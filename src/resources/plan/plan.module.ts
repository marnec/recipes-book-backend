import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { Plan } from './entities/plan.entity';
import { PlanRepository } from './plan.repository';
import { provideCustomRepository } from 'src/shared/provide-custom-repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [PlanController],
  providers: [PlanService, provideCustomRepository(Plan, PlanRepository)]
})
export class PlanModule {}
