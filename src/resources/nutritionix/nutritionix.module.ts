import { Module } from '@nestjs/common';
import { NutritionixService } from './nutritionix.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [NutritionixService,]
})
export class NutritionixModule {}
