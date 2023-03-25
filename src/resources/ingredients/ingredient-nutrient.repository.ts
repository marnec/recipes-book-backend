import { Repository } from 'typeorm';
import { IngredientNutrient } from './entities/ingredient_nutrients.entity';

export class IngredientNutrientRepository extends Repository<IngredientNutrient> {}
