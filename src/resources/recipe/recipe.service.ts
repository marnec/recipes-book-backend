import { Injectable } from '@nestjs/common';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeFilterDto } from './dto/recipe-filter.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeRepository } from './recipe.repository';

@Injectable()
export class RecipeService {
  constructor(private recipeRepository: RecipeRepository) {}

  create(createRecipeDto: CreateRecipeDto) {
    this.recipeRepository.save(createRecipeDto);
  }

  findAll(filter: RecipeFilterDto, { take, skip, order }: Pageable) {
    this.recipeRepository.findAndCount({ ...filter, take, skip, order });
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
