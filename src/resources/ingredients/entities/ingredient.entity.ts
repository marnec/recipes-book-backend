import { Recipe } from 'src/resources/recipe/entities/recipe.entity';
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToMany(() => Recipe, (recipe) => recipe.ingredients)
  recipes: Recipe[];
}
