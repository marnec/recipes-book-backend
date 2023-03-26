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

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return this.recipeRepository.save({ id, ...updateRecipeDto });
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
  async remove(id: string): Promise<DeleteResult> {
    await this.recipeIngredientRepository.delete({ recipeId: id });
    await this.userService.dissociateFromRecipe(id);
    return this.recipeRepository.delete({ id });
  }
}
