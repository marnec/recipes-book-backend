import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { HttpModule } from '@nestjs/axios';
import { NutritionixService } from '../nutritionix/nutritionix.service';

@Module({
  imports: [HttpModule],
  controllers: [IngredientsController],
  providers: [IngredientsService, NutritionixService]
})
export class IngredientsModule {}
