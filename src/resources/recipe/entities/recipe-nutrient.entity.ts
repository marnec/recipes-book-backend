import { Nutrient } from 'src/resources/nutrients/entities/nutrient.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity({ name: 'recipes_nutrients' })
export class RecipeNutrient extends BaseEntity {
  @PrimaryColumn({ name: 'recipe_id' })
  recipeId: string;

  @PrimaryColumn({ name: 'nutrient_id' })
  nutrientId: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.nutrients)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => Nutrient, (nutrient) => nutrient.nutrientRecipes)
  @JoinColumn({ name: 'nutrient_id' })
  nutrient: Nutrient;

  @Column({ type: 'float' })
  amount?: number;
}
