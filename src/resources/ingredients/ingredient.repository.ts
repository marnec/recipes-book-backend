import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';

export class IngredientRepository extends Repository<Ingredient> {}
