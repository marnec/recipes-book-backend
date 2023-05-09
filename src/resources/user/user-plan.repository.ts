import { Repository } from 'typeorm';
import { UserPlan } from './entities/user-plan.entity';

export class UserPlanRepository extends Repository<UserPlan> {}
