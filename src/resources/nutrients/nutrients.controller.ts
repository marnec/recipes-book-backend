import { Controller, Post } from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';
import { NutrientsService } from './nutrients.service';

@Controller('nutrients')
export class NutrientsController {
  constructor(private readonly nutrientsService: NutrientsService) {}

  @Post('/nutritionix')
  async syncNutrients(): Promise<(InsertResult | UpdateResult)[]> {
    return this.nutrientsService.syncNutrients();
  }
}
