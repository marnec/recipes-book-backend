import { Nutrient } from 'src/resources/nutrients/entities/nutrient.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Ingredient } from './ingredient.entity';

@Entity({ name: 'ingredients_nutrients' })
export class IngredientNutrient extends BaseEntity {
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.nutrients)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient?: Ingredient;

  @ManyToOne(() => Nutrient, (nutrient) => nutrient.nutrientIngredients)
  @JoinColumn({ name: 'nutrient_id' })
  nutrient?: Nutrient;

  @PrimaryColumn({ name: 'ingredient_id' })
  ingredientId: string;

  @PrimaryColumn({ name: 'nutrient_id' })
  nutrientId: string;

  @Column({ type: 'float' })
  amount: number;
}
