import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { SpawnSyncReturns, spawnSync } from 'child_process';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  logger = new Logger(PlanService.name);

  create(createPlanDto: CreatePlanDto) {
    let pythonProcess: SpawnSyncReturns<Buffer>;
    try {
      pythonProcess = spawnSync('python3', ['/app/src/resources/plan/test.py']);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    const result = pythonProcess.stdout?.toString()?.trim();
    const error = pythonProcess.stderr?.toString()?.trim();

    return result;
  }

  findAll() {
    return `This action returns all plan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
