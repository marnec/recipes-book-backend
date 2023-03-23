import { Injectable } from '@nestjs/common';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import { DeleteResult } from 'typeorm';
import { IngredientSearchResult } from '../ingredients/dto/ingredients-search-results.dto';
import { IngredientsService } from '../ingredients/ingredients.service';
import { NutritionixService } from '../nutritionix/nutritionix.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeFilterDto } from './dto/recipe-filter.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { RecipeRepository } from './recipe.repository';

@Injectable()
export class RecipeService {
  constructor(
    private recipeRepository: RecipeRepository,
    private nutritionix: NutritionixService,
    private ingredientService: IngredientsService
  ) {}

  findOne(id: string): Promise<Recipe> {
    return this.recipeRepository.findOneByOrFail({ id });
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

  async associateNewIngredient(
    id: string,
    newIngredient: Pick<IngredientSearchResult, 'foodName'>
  ) {
    throw new Error('Method not implemented.');
  }

  async associateIngredient(id: string, ingredient: IngredientSearchResult) {
    const enrichedIngredients = ingredient.fullNutrients
      .map((nutrient) => ({
        ...nutrient,
        ...this.nutritionix.nutrientsMap$.value[nutrient.attrId]
      }))

    console.log(enrichedIngredients);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.recipeRepository.delete({ id });
  }
}
