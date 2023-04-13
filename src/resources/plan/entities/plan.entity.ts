import { UserPlan } from 'src/resources/user/entities/user-plan.entity';
import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanRecipe } from './plan-recipes.entity';

@Entity({ name: 'plans' })
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => UserPlan, (userPlan) => userPlan.plan)
  userPlans: UserPlan[];

  @OneToMany(() => PlanRecipe, (planRecipe) => planRecipe.plan)
  planRecipes: PlanRecipe[];
}
