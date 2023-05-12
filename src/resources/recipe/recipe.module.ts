import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { RecipeRepository } from './recipe.repository';
import { provideCustomRepository } from 'src/shared/provide-custom-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { NutrientsModule } from '../nutrients/nutrients.module';
import { UserModule } from '../user/user.module';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { RecipeIngredientRepository } from './recipe-ingredient.repository';
import { RecipeNutrient } from './entities/recipe-nutrient.entity';
import { RecipeNutrientRepository } from './recipe-nutrient.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, RecipeIngredient]),
    NutrientsModule,
    IngredientsModule,
    UserModule
  ],
  controllers: [RecipeController],
  providers: [
    RecipeService,
    provideCustomRepository(Recipe, RecipeRepository),
    provideCustomRepository(RecipeIngredient, RecipeIngredientRepository),
    provideCustomRepository(RecipeNutrient, RecipeNutrientRepository)
  ],
  exports: [RecipeService]
})
export class RecipeModule {}
