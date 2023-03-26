import { Repository } from 'typeorm';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';

export class RecipeIngredientRepository extends Repository<RecipeIngredient> {
  async getNextOrder(recipeId: string) {
    const lastIngredient = await this.findOne({ where: { recipeId }, order: { order: 'DESC' } });

    if (!lastIngredient) {
      return 0;
    }

    return lastIngredient.order + 1;
  }
}
