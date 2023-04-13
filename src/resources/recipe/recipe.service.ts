import { Injectable } from '@nestjs/common';
import { omit } from 'radash';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import {
  DeleteResult,
  Equal,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  UpdateResult
} from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { IngredientSearchResult } from '../ingredients/dto/ingredients-search-results.dto';
import { IngredientsService } from '../ingredients/ingredients.service';
import { NutrientsService } from '../nutrients/nutrients.service';
import { UserRole } from '../user/entities/user-recipe.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { IngredientQuantityDto } from './dto/ingredient-quantity.dto';
import { RecipeFilterDto } from './dto/recipe-filter.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredientRepository } from './recipe-ingredient.repository';
import { RecipeRepository } from './recipe.repository';

@Injectable()
export class RecipeService {
  constructor(
    private recipeRepository: RecipeRepository,
    private recipeIngredientRepository: RecipeIngredientRepository,
    private ingredientService: IngredientsService,
    private nutrientsService: NutrientsService,
    private userService: UserService
  ) {}

  findOne(id: string): Promise<Recipe> {
    return this.recipeRepository.findOne({
      where: { id },
      order: { ingredients: { order: 'ASC' } },
      relations: { ingredients: { ingredient: true } }
    });
  }

  async findAll(
    filter: RecipeFilterDto,
    { take, skip, order }: Pageable
  ): Promise<[Recipe[], number]> {
    return this.recipeRepository.findAndCount({
      take,
      skip,
      order,
      where: { collaborators: { user: { uid: Equal(filter.uid) } } }
    });
  }

  async create(createRecipeDto: CreateRecipeDto) {
    const user: User = await this.userService.getByUid(createRecipeDto.uid);

    let recipe = this.recipeRepository.create(omit(createRecipeDto, ['uid']));
    recipe = await this.recipeRepository.save(recipe);

    await this.userService.associateToRecipe(user.id, recipe.id, UserRole.owner);

    return recipe;
  }

  @Transactional()
  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const { servings } = updateRecipeDto;

    const recipe = await this.recipeRepository.findOneBy({ id });

    const ingredients = await this.recipeIngredientRepository.find({
      where: { recipeId: id },
      relations: { ingredient: true }
    });

    const nextServingSize = getNextAllowedServingSize(
      recipe.servings,
      updateRecipeDto.servings,
      ingredients
    );
    console.log('nextServingSize', nextServingSize);

    if (recipe && recipe.servings && recipe.servings != servings) {
      this.recipeIngredientRepository
        .createQueryBuilder()
        .update(RecipeIngredient)
        .set({ quantity: () => `("quantity" /${recipe.servings}) * ${servings}` })
        .where({ recipeId: Equal(recipe.id) })
        .execute();
    }
    await this.recipeRepository.update({ id }, updateRecipeDto);

    return this.findOne(id);
  }

  async associateNewIngredient(
    id: string,
    { foodName }: Pick<IngredientSearchResult, 'foodName'>
  ): Promise<RecipeIngredient> {
    const ingredient = await this.ingredientService.create({ name: foodName, set: 0 });

    const order = await this.recipeIngredientRepository.getNextOrder(id);

    const recipeIngredient = this.recipeIngredientRepository.create({
      recipeId: id,
      ingredient,
      order
    });

    return this.recipeIngredientRepository.save(recipeIngredient);
  }

  @Transactional()
  async associateIngredient(
    id: string,
    selectedIngredient: IngredientSearchResult
  ): Promise<RecipeIngredient> {
    const ingredient = await this.ingredientService.createIfNotExists(selectedIngredient);

    await this.nutrientsService.associateNutrients(ingredient.id, selectedIngredient.fullNutrients);

    const order = await this.recipeIngredientRepository.getNextOrder(id);

    const recipeIngredient = this.recipeIngredientRepository.create({
      recipeId: id,
      ingredient,
      order
    });

    return this.recipeIngredientRepository.save(recipeIngredient);
  }

  @Transactional()
  async dissociateIngredient(recipeId: string, ingredientId: string): Promise<DeleteResult> {
    const deletedIngredient = await this.recipeIngredientRepository.findOne({
      where: { recipeId, ingredientId }
    });

    const deleteResult = await this.recipeIngredientRepository.delete({ recipeId, ingredientId });

    await this.recipeIngredientRepository
      .createQueryBuilder()
      .update(RecipeIngredient)
      .set({ order: () => '"order" - 1' })
      .where({ order: MoreThan(deletedIngredient.order) })
      .andWhere({ recipeId: recipeId })
      .execute();

    return deleteResult;
  }

  @Transactional()
  async reorderIngredients(id: string, ingredientId: string, from: number, to: number) {
    if (from < to) {
      await this.recipeIngredientRepository
        .createQueryBuilder()
        .update(RecipeIngredient)
        .set({ order: () => '"order" - 1' })
        .where({ recipeId: id })
        .andWhere({ order: MoreThan(from) })
        .andWhere({ order: LessThanOrEqual(to) })
        .execute();
    } else if (from > to) {
      await this.recipeIngredientRepository
        .createQueryBuilder()
        .update(RecipeIngredient)
        .set({ order: () => '"order" + 1' })
        .where({ recipeId: id })
        .andWhere({ order: MoreThanOrEqual(to) })
        .andWhere({ order: LessThan(from) })
        .execute();
    }

    await this.recipeIngredientRepository.update({ recipeId: id, ingredientId }, { order: to });
  }

  @Transactional()
  setIngredientQuantity(
    recipeId: string,
    ingredientId: string,
    quantityDto: IngredientQuantityDto
  ): Promise<UpdateResult> {
    return this.recipeIngredientRepository.update({ recipeId, ingredientId }, quantityDto);
  }

  @Transactional()
  async remove(id: string): Promise<DeleteResult> {
    await this.recipeIngredientRepository.delete({ recipeId: id });
    await this.userService.dissociateFromRecipe(id);
    return this.recipeRepository.delete({ id });
  }
}

// Utility function to find the least common multiple of an array of integers
function findLeastCommonMultiple(numbers: number[]): number {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
  return numbers.reduce((result, number) => lcm(result, number), 1);
}

function getNextAllowedServingSize(
  originalServingSize: number,
  targetServingSize: number,
  ingredients: RecipeIngredient[]
) {
  const scalingFactor = targetServingSize / originalServingSize

  const qs = ingredients
    .filter((ingredient) => !ingredient.unit)
    .map((ingredient) => ingredient.quantity * scalingFactor)
  
  console.log(targetServingSize, qs,   qs.map((q) => Number.isInteger(q)));

  console.log(qs);



  // return originalServingSize * lcm;
}
