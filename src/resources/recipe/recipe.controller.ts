import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { FilteredPaginatedQuery } from 'src/shared/filtered-query.decorator';
import { Recipe } from './entities/recipe.entity';
import { RecipeFilterDto } from './dto/recipe-filter.dto';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import { PaginatedResult } from 'src/shared/paginated-result.dto';
import { DeleteResult } from 'typeorm';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }

  @Get()
  @FilteredPaginatedQuery(Recipe)
  async findAll(
    @Query() filter: RecipeFilterDto,
    pageable: Pageable
  ): Promise<PaginatedResult<Recipe>> {
    const results = await this.recipeService.findAll(filter, pageable);
    return new PaginatedResult<Recipe>(...results);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Recipe> {
    return this.recipeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.recipeService.remove(id);
  }
}
