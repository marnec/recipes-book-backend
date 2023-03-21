import { Ingredient } from 'src/resources/ingredients/entities/ingredient.entity';
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'recipes' })
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 8000, nullable: true })
  body: string;

  @Column({ type: 'int', nullable: true })
  servings: number;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.recipes)
  @JoinTable()
  ingredients: Ingredient[];
}
