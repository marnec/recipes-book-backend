import { Plan } from 'src/resources/plan/entities/plan.entity';
import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'users_plans' })
export class UserPlan extends BaseEntity {
  @ManyToOne(() => Plan, (plan) => plan.userPlans)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @ManyToOne(() => User, (user) => user.userPlans)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @PrimaryColumn({ name: 'plan_id' })
  planId: string;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;
}
