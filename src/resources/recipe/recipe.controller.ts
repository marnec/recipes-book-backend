import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import { FilteredPaginatedQuery } from 'src/shared/filtered-query.decorator';
import { PaginatedResult } from 'src/shared/paginated-result.dto';
import { DeleteResult } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeFilterDto } from './dto/recipe-filter.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { RecipeService } from './recipe.service';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Recipe> {
    return this.recipeService.findOne(id);
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

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.recipeService.remove(id);
  }
}
