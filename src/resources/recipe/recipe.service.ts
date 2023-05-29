import { Injectable } from '@nestjs/common';
import { omit } from 'radash';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import {
  DeleteResult,
  Equal,
  FindOptionsRelations,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
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
import { BasePaginatedFilterDto } from 'src/shared/base-paginated-filter.dto';
import { RecipeNutrientRepository } from './recipe-nutrient.repository';
import { RecipeNutrient } from './entities/recipe-nutrient.entity';

@Injectable()
export class RecipeService {
  constructor(
    private recipeRepository: RecipeRepository,
    private recipeIngredientRepository: RecipeIngredientRepository,
    // private recipeNutrientRepository: RecipeNutrientRepository,
    private ingredientService: IngredientsService,
    private nutrientsService: NutrientsService,
    private userService: UserService
  ) { }

  async findOne(id: string): Promise<Recipe> {
    return this.recipeRepository.findOne({
      where: { id },
      order: { ingredients: { order: 'ASC' } },
      relations: { ingredients: { ingredient: true } }
    });
  }

  async findAll(
    filter: Omit<RecipeFilterDto, keyof BasePaginatedFilterDto>,
    { take, skip, order }: Pageable,
    relations: FindOptionsRelations<Recipe> = null
  ): Promise<[Recipe[], number]> {
    return this.recipeRepository.findAndCount({
      take,
      skip,
      order,
      where: { collaborators: { user: { uid: Equal(filter.uid) } }, ingredients: { ingredient: { nutrients: { nutrient: { unit: Not('IU') } } } } },
      relations
    });
  }

  async create(createRecipeDto: CreateRecipeDto) {
    const user: User = await this.userService.getByUid(createRecipeDto.uid);

    let recipe = this.recipeRepository.create(omit(createRecipeDto, ['uid']));
    recipe = await this.recipeRepository.save(recipe);

    await this.userService.associateToRecipe(user.id, recipe.id, UserRole.owner);

    // const nutrients = await this.nutrientsService.findAll();

    // await this.recipeNutrientRepository.save(
    //   nutrients.map((nutrient) =>
    //     this.recipeNutrientRepository.create({ recipe, nutrient, amount: 0 })
    //   )
    // );

    return recipe;
  }

  @Transactional()
  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const { servings } = updateRecipeDto;

    const recipe = await this.recipeRepository.findOneBy({ id });

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

  @Transactional()
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

    const nutrients = await this.nutrientsService.associateNutrients(
      ingredient.id,
      selectedIngredient.fullNutrients
    );


    // await Promise.all(
    //   nutrients.map(({ amount, nutrientId }) => {
    //     return this.recipeNutrientRepository.increaseByAmount(id, nutrientId, amount);
    //   })
    // );

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
      where: { recipeId, ingredientId },
      relations: { ingredient: { nutrients: { nutrient: true } } }
    });

    // await Promise.all(
    //   deletedIngredient.ingredient.nutrients.map(({ amount, nutrient }) => {
    //     return this.recipeNutrientRepository.decreaseByAmount(recipeId, nutrient.id, amount);
    //   })
    // );

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
    // await this.recipeNutrientRepository.delete({ recipeId: id });
    await this.userService.dissociateFromRecipe(id);
    return this.recipeRepository.delete({ id });
  }
}
