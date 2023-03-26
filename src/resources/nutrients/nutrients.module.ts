import { Module } from '@nestjs/common';
import { NutrientsService } from './nutrients.service';
import { NutrientsController } from './nutrients.controller';
import { NutritionixModule } from '../nutritionix/nutritionix.module';
import { provideCustomRepository } from 'src/shared/provide-custom-repository';
import { Nutrient } from './entities/nutrient.entity';
import { NutrientRepository } from './nutrient.repository';
import { IngredientNutrient } from '../ingredients/entities/ingredient_nutrients.entity';
import { IngredientNutrientRepository } from '../ingredients/ingredient-nutrient.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Nutrient]), NutritionixModule],
  controllers: [NutrientsController],
  providers: [
    NutrientsService,
    provideCustomRepository(Nutrient, NutrientRepository),
    provideCustomRepository(IngredientNutrient, IngredientNutrientRepository)
  ],
  exports: [NutrientsService]
})
export class NutrientsModule {}
