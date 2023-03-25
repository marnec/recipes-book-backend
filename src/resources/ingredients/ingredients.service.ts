import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientRepository } from './ingredient.repository';

@Injectable()
export class IngredientsService {
  constructor(private ingredientRepository: IngredientRepository) {}

  create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    return this.ingredientRepository.save(createIngredientDto)
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  findOneByTagId(tagId: number): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({where: { externalId: tagId }});
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
