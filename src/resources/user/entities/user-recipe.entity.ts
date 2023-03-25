import { Recipe } from 'src/resources/recipe/entities/recipe.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

export enum UserRole {
  owner = 'owner',
  editor = 'editor'
}

@Entity({ name: 'users_recipes' })
export class UserRecipe extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'recipe_id' })
  recipeId: string;

  @Column({ type: 'varchar' })
  role: UserRole;

  @ManyToOne(() => User, (user) => user.recipes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.collaborators)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;
}
