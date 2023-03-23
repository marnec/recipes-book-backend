import { Nutrient } from 'src/resources/nutrients/entities/nutrient.entity';
import { Recipe } from 'src/resources/recipe/entities/recipe.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'ingredients' })
export class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'int' })
  set: number;

  @Column({ type: 'varchar' })
  unit: string;

  @Column({ type: 'float' })
  amount: number;

  // nutritionix fields
  @Column({ type: 'int', name: 'external_id' })
  externalId: number;

  @ManyToMany(() => Recipe, (recipe) => recipe.ingredients)
  recipes: Recipe[];

  @ManyToMany(() => Nutrient)
  @JoinTable({
    name: 'ingredients_nutrients',
    joinColumn: {
      name: 'ingredient_id'
    },
    inverseJoinColumn: {
      name: 'nutrient_id'
    }
  })
  nutrients: Nutrient[];
}
