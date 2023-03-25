import { Injectable } from '@nestjs/common';
import { objectify } from 'radash';
import { firstValueFrom } from 'rxjs';
import { DeepPartial, InsertResult, UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { IngredientFullNutrient } from '../ingredients/dto/ingredients-search-results.dto';
import { IngredientNutrient } from '../ingredients/entities/ingredient_nutrients.entity';
import { IngredientNutrientRepository } from '../ingredients/ingredient-nutrient.repository';
import { NutritionixService } from '../nutritionix/nutritionix.service';
import { Nutrient } from './entities/nutrient.entity';
import { NutrientRepository } from './nutrient.repository';

@Injectable()
export class NutrientsService {
  constructor(
    private nutritionix: NutritionixService,
    private nutrientRepository: NutrientRepository,
    private ingredientNutrientRepository: IngredientNutrientRepository
  ) {}

  @Transactional()
  async syncNutrients(): Promise<(InsertResult | UpdateResult)[]> {
    const nutrients = await firstValueFrom(this.nutritionix.getNutrients());

    return Promise.all(
      nutrients.map(async ({ attrId, usdaNutrDesc, usdaTag, usdaSrOrder, fdaDailyValue, unit }) => {
        const nutrientData: DeepPartial<Nutrient> = {
          externalId: attrId,
          description: usdaNutrDesc,
          usdaCode: usdaTag,
          usdaOrder: usdaSrOrder,
          fdaDaily: fdaDailyValue,
          unit
        };

        const nutrient = await this.nutrientRepository.findOneBy({ externalId: attrId });

        if (!nutrient) {
          return this.nutrientRepository.insert(nutrientData);
        }

        return this.nutrientRepository.update({ id: nutrient.id }, nutrientData);
      })
    );
  }

  @Transactional()
  async associateNutrients(
    ingredientId: string,
    nutrients: IngredientFullNutrient[]
  ): Promise<IngredientNutrient[]> {
    const nutrientMap = objectify(await this.findAll(), (n) => n.externalId);

    const ingredientNutrients = nutrients.map((nutrient) =>
      this.ingredientNutrientRepository.create({
        nutrientId: nutrientMap[nutrient.attrId].id,
        ingredientId: ingredientId,
        amount: nutrient.value
      })
    );

    return this.ingredientNutrientRepository.save(ingredientNutrients);
  }

  findAll(): Promise<Nutrient[]> {
    return this.nutrientRepository.find();
  }
}
