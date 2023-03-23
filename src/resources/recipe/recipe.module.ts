import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { RecipeRepository } from './recipe.repository';
import { provideCustomRepository } from 'src/shared/provide-custom-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { NutritionixModule } from '../nutritionix/nutritionix.module';
import { IngredientsModule } from '../ingredients/ingredients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), NutritionixModule, IngredientsModule],
  controllers: [RecipeController],
  providers: [RecipeService, provideCustomRepository(Recipe, RecipeRepository)]
})
export class RecipeModule {}
