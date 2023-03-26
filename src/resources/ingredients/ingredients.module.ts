import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { provideCustomRepository } from 'src/shared/provide-custom-repository';
import { NutrientsModule } from '../nutrients/nutrients.module';
import { NutritionixModule } from '../nutritionix/nutritionix.module';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientNutrient } from './entities/ingredient_nutrients.entity';
import { IngredientRepository } from './ingredient.repository';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient, IngredientNutrient]),
    HttpModule,
    NutritionixModule,
    NutrientsModule
  ],
  controllers: [IngredientsController],
  providers: [provideCustomRepository(Ingredient, IngredientRepository), IngredientsService],
  exports: [IngredientsService]
})
export class IngredientsModule {}
