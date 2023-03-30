import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { NutrientsService } from '../nutrients/nutrients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { IngredientSearchResult } from './dto/ingredients-search-results.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientNutrient } from './entities/ingredient_nutrients.entity';
import { IngredientRepository } from './ingredient.repository';

@Injectable()
export class IngredientsService {
  constructor(
    private ingredientRepository: IngredientRepository,
    private nutrientService: NutrientsService
  ) {}

  create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    return this.ingredientRepository.save(createIngredientDto);
  }

  @Transactional()
  async createIfNotExists(selectedIngredient: IngredientSearchResult): Promise<Ingredient> {
    let ingredient = await this.findOneByTagId(selectedIngredient.tagId);

    if (!ingredient) {
      ingredient = await this.create({
        externalId: selectedIngredient.tagId,
        name: selectedIngredient.foodName,
        unit: selectedIngredient.servingUnit,
        amount: selectedIngredient.servingQty,
        servingGrams: selectedIngredient.servingWeightGrams,
        set: 0
      });
    }

    return ingredient;
  }

  @Transactional()
  async link(
    nutrientsTargetId: string,
    nutrientsSource: IngredientSearchResult
  ): Promise<IngredientNutrient[]> {
    const ingredientSource = await this.createIfNotExists(nutrientsSource);

    await this.nutrientService.associateNutrients(
      ingredientSource.id,
      nutrientsSource.fullNutrients
    );
    
    await this.ingredientRepository.update(
      { id: nutrientsTargetId },
      { nutrientsSourceId: ingredientSource.externalId }
    );

    return this.nutrientService.associateNutrients(
      nutrientsTargetId,
      nutrientsSource.fullNutrients
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  findOneByTagId(externalId: number): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({
      where: { externalId }
    });
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
