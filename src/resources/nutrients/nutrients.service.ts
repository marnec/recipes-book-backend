import { Injectable } from '@nestjs/common';
import { objectify } from 'radash';
import { firstValueFrom } from 'rxjs';
import { InsertResult, UpdateResult } from 'typeorm';
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
    let nutrients = await firstValueFrom(this.nutritionix.getNutrients());

    return Promise.all(
      nutrients
        .map(({ attrId, usdaNutrDesc, usdaTag, usdaSrOrder, fdaDailyValue, unit }) =>
          this.nutrientRepository.create({
            externalId: attrId,
            description: usdaNutrDesc,
            usdaCode: usdaTag,
            usdaOrder: usdaSrOrder,
            fdaDaily: fdaDailyValue,
            unit
          })
        )
        .concat(this.integrateMissingNutrients())
        .map(async (nutrientData: Nutrient) => {
          const nutrient = await this.nutrientRepository.findOneBy({
            externalId: nutrientData.externalId
          });

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

    const ingredientNutrients = nutrients.map((nutrient) => {
      return this.ingredientNutrientRepository.create({
        nutrientId: nutrientMap[nutrient.attrId].id,
        ingredientId: ingredientId,
        amount: nutrient.value
      });
    });

    return this.ingredientNutrientRepository.save(ingredientNutrients, { chunk: 100 });
  }

  findAll(): Promise<Nutrient[]> {
    return this.nutrientRepository.find();
  }

  integrateMissingNutrients(): Nutrient[] {
    return [
      this.nutrientRepository.create({
        externalId: 344,
        usdaCode: 'TOCTRA',
        description: 'Tocotrienol, alpha',
        unit: 'mg',
        usdaOrder: null,
        fdaDaily: null
      }),
      this.nutrientRepository.create({
        externalId: 345,
        usdaCode: 'TOCTRB',
        description: 'Tocotrienol, beta',
        unit: 'mg',
        usdaOrder: null,
        fdaDaily: null
      }),
      this.nutrientRepository.create({
        externalId: 346,
        usdaCode: 'TOCTRG',
        description: 'Tocotrienol, gamma',
        unit: 'mg',
        usdaOrder: null,
        fdaDaily: null
      }),
      this.nutrientRepository.create({
        externalId: 347,
        usdaCode: 'TOCTRD',
        description: 'Tocotrienol, delta',
        unit: 'mg',
        usdaOrder: null,
        fdaDaily: null
      })
    ];
  }
}
