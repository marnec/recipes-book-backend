import {
  Body, Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NutritionixService } from '../nutritionix/nutritionix.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { IngredientsFilterDto } from './dto/ingredients-filter.dto';
import { IngredientSearchResult } from './dto/ingredients-search-results.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientNutrient } from './entities/ingredient_nutrients.entity';
import { IngredientsService } from './ingredients.service';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly ingredientsService: IngredientsService,
    private nutritionix: NutritionixService
  ) {}

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Post(':id')
  link(@Param('id') linkTargetId: string, @Body() nutrientSource: IngredientSearchResult): Promise<IngredientNutrient[]> {
    return this.ingredientsService.link(linkTargetId, nutrientSource);
  }

  @Get()
  find(@Query() filter: IngredientsFilterDto): Observable<IngredientSearchResult[]> {
    return this.nutritionix.searchIngredient(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientsService.update(+id, updateIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(+id);
  }
}
