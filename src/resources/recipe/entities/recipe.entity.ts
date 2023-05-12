import { UserRecipe } from 'src/resources/user/entities/user-recipe.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { PlanRecipe } from 'src/resources/plan/entities/plan-recipes.entity';
import { RecipeNutrient } from './recipe-nutrient.entity';

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

  @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe)
  ingredients: RecipeIngredient[];

  @OneToMany(() => RecipeNutrient, (recipeNutrients) => recipeNutrients.recipe)
  nutrients: RecipeNutrient[];

  @OneToMany(() => UserRecipe, (userRecipe) => userRecipe.recipe)
  collaborators: UserRecipe[];

  @OneToMany(() => PlanRecipe, (planRecipe) => planRecipe.recipe)
  @JoinColumn({ name: 'plan_id' })
  planRecipes: PlanRecipe[];
}
