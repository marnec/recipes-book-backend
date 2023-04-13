import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Plan } from './plan.entity';
import { Recipe } from 'src/resources/recipe/entities/recipe.entity';

@Entity({ name: 'plans_recipes' })
export class PlanRecipe extends BaseEntity {
  @ManyToOne(() => Plan, (plan) => plan.planRecipes)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @ManyToOne(() => Recipe, (recipe) => recipe.planRecipes)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @PrimaryColumn({ name: 'plan_id' })
  planId: string;

  @PrimaryColumn({ name: 'recipe_id' })
  recipeId: string;
}
