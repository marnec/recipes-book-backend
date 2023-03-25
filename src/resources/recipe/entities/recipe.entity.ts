import { Ingredient } from 'src/resources/ingredients/entities/ingredient.entity';
import { UserRecipe } from 'src/resources/user/entities/user-recipe.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

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

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.recipes, {
    onDelete: 'NO ACTION',
    cascade: ['insert', 'update']
  })
  @JoinTable({
    name: 'recipes_ingredients',
    joinColumn: { name: 'recipe_id' },
    inverseJoinColumn: { name: 'ingredient_id' }
  })
  ingredients: Ingredient[];

  @OneToMany(() => UserRecipe, (userRecipe) => userRecipe.recipe)
  collaborators: UserRecipe[];
}
