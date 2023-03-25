import { Recipe } from 'src/resources/recipe/entities/recipe.entity';
import {
  BaseEntity,
  Column,
  Entity, ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { IngredientNutrient } from './ingredient_nutrients.entity';

@Entity({ name: 'ingredients' })
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'int' })
  set: number;

  @Column({ type: 'varchar', nullable: true })
  unit: string;

  @Column({ type: 'float', nullable: true })
  amount?: number;

  @Column({ type: 'int', name: 'external_id', nullable: true })
  externalId: number;

  @ManyToMany(() => Recipe, (recipe) => recipe.ingredients)
  recipes?: Recipe[];

  @OneToMany(() => IngredientNutrient, (ingredientNutrients) => ingredientNutrients.ingredient)
  ingredientNutrients?: IngredientNutrient[]
}
