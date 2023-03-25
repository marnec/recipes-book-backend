import { OmitType } from '@nestjs/swagger';
import { baseEntitykeys } from 'src/shared/constants';
import { Ingredient } from '../entities/ingredient.entity';

export class CreateIngredientDto extends OmitType(Ingredient, baseEntitykeys) {}
