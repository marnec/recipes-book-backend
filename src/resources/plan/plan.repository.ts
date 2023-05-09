import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';

export class PlanRepository extends Repository<Plan> {}
