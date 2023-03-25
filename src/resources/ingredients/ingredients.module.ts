import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { provideCustomRepository } from 'src/shared/provide-custom-repository';
import { NutritionixModule } from '../nutritionix/nutritionix.module';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientRepository } from './ingredient.repository';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [HttpModule, NutritionixModule],
  controllers: [IngredientsController],
  providers: [
    provideCustomRepository(Ingredient, IngredientRepository),
    IngredientsService
  ],
  exports: [IngredientsService]
})
export class IngredientsModule {}
