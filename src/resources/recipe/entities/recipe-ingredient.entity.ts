import { Ingredient } from 'src/resources/ingredients/entities/ingredient.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity({ name: 'recipes_ingredients' })
export class RecipeIngredient extends BaseEntity {
  @PrimaryColumn({ name: 'recipe_id' })
  recipeId: string;

  @PrimaryColumn({ name: 'ingredient_id' })
  ingredientId: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipes)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'float', nullable: true })
  amount?: number;

  @Column({ type: 'varchar', nullable: true })
  unit?: string;
}
