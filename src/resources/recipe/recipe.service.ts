import { Injectable } from '@nestjs/common';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import { DeleteResult } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeFilterDto } from './dto/recipe-filter.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { RecipeRepository } from './recipe.repository';

@Injectable()
export class RecipeService {
  constructor(private recipeRepository: RecipeRepository) {}

  async create(createRecipeDto: CreateRecipeDto) {
    return this.recipeRepository.save(createRecipeDto);
  }

  async findAll(
    filter: RecipeFilterDto,
    { take, skip, order }: Pageable
  ): Promise<[Recipe[], number]> {
    return this.recipeRepository.findAndCount({ ...filter, take, skip, order });
  }

  findOne(id: string): Promise<Recipe> {
    return this.recipeRepository.findOneByOrFail({ id });
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.recipeRepository.delete({ id });
  }
}
