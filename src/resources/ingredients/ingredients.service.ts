import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientRepository } from './ingredient.repository';

@Injectable()
export class IngredientsService {
  constructor(private ingredientRepository: IngredientRepository) {}

  create(createIngredientDto: CreateIngredientDto) {
    return 'This action adds a new ingredient';
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  findOneByAttrId(attrId: number): Promise<Ingredient | null> {
    return this.ingredientRepository.findOneBy({ externalId: attrId });
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
