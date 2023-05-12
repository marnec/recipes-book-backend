import { Equal, Repository, UpdateResult } from 'typeorm';
import { RecipeNutrient } from './entities/recipe-nutrient.entity';

export class RecipeNutrientRepository extends Repository<RecipeNutrient> {
  async increaseByAmount(
    recipeId: string,
    nutrientId: string,
    amount: number
  ): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(RecipeNutrient)
      .set({ amount: () => `("amount" + ${amount})` })
      .where({ recipeId: Equal(recipeId) })
      .andWhere({ nutrientId: Equal(nutrientId) })
      .execute();
  }

  async decreaseByAmount(
    recipeId: string,
    nutrientId: string,
    amount: number
  ): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(RecipeNutrient)
      .set({ amount: () => `("amount" - ${amount})` })
      .where({ recipeId: Equal(recipeId) })
      .andWhere({ nutrientId: Equal(nutrientId) })
      .execute();
  }
}
