import { Injectable } from '@nestjs/common';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import { DeleteResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { IngredientSearchResult } from '../ingredients/dto/ingredients-search-results.dto';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { IngredientsService } from '../ingredients/ingredients.service';
import { NutrientsService } from '../nutrients/nutrients.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeFilterDto } from './dto/recipe-filter.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { RecipeRepository } from './recipe.repository';

@Injectable()
export class RecipeService {
  constructor(
    private recipeRepository: RecipeRepository,
    private ingredientService: IngredientsService,
    private nutrientsService: NutrientsService
  ) {}

  findOne(id: string): Promise<Recipe> {
    return this.recipeRepository.findOne({
      where: { id },
      relations: { ingredients: true }
    });
  }

  async findAll(
    filter: RecipeFilterDto,
    { take, skip, order }: Pageable
  ): Promise<[Recipe[], number]> {
    return this.recipeRepository.findAndCount({ ...filter, take, skip, order });
  }

  async create(createRecipeDto: CreateRecipeDto) {
    return this.recipeRepository.save(createRecipeDto);
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return this.recipeRepository.save({ id, ...updateRecipeDto });
  }

  async associateNewIngredient(id: string, { foodName }: Pick<IngredientSearchResult, 'foodName'>): Promise<Recipe> {
    const ingredient = await this.ingredientService.create({ name: foodName, set: 0 });

    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: { ingredients: true }
    });

    recipe.ingredients.push(ingredient);

    return this.recipeRepository.save(recipe);
  }

  @Transactional()
  async associateIngredient(
    id: string,
    selectedIngredient: IngredientSearchResult
  ): Promise<Recipe> {
    let ingredient = await this.ingredientService.findOneByTagId(selectedIngredient.tagId);

    if (!ingredient) {
      ingredient = await this.ingredientService.create({
        externalId: selectedIngredient.tagId,
        name: selectedIngredient.foodName,
        unit: selectedIngredient.servingUnit,
        set: 0
      });
    }

    await this.nutrientsService.associateNutrients(ingredient.id, selectedIngredient.fullNutrients);

    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: { ingredients: true }
    });

    recipe.ingredients.push(ingredient);

    return this.recipeRepository.save(recipe);
  }

  @Transactional()
  async dissociateIngredient(id: string, ingredientId: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: { ingredients: true }
    });

    recipe.ingredients = recipe.ingredients.filter((ingredient) => ingredient.id != ingredientId);

    return this.recipeRepository.save(recipe);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.recipeRepository.delete({ id });
  }
}
