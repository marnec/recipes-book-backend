import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { RecipeRepository } from './recipe.repository';
import { provideCustomRepository } from 'src/shared/provide-custom-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { NutrientsModule } from '../nutrients/nutrients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe]), NutrientsModule, IngredientsModule],
  controllers: [RecipeController],
  providers: [RecipeService, provideCustomRepository(Recipe, RecipeRepository)]
})
export class RecipeModule {}
