import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { SpawnSyncReturns, spawnSync } from 'child_process';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanRepository } from './plan.repository';
import { UserPlanRepository } from '../user/user-plan.repository';
import { UserService } from '../user/user.service';
import { Transactional } from 'typeorm-transactional';
import { existsSync, mkdirSync } from 'fs';
import { PLAN_DIR, unPaged } from 'src/shared/constants';
import { RecipeService } from '../recipe/recipe.service';

@Injectable()
export class PlanService {
  logger = new Logger(PlanService.name);

  constructor(
    private planRepository: PlanRepository,
    private userPlanRepository: UserPlanRepository,
    private userService: UserService,
    private recipeService: RecipeService
  ) {}

  @Transactional()
  async create(createPlanDto: CreatePlanDto, userUid: string) {
    const plan = await this.planRepository.save(this.planRepository.create());
    const user = await this.userService.getByUid(userUid);

    const userPlan = await this.userPlanRepository.save(
      this.userPlanRepository.create({
        plan,
        user
      })
    );

    const dir = `${PLAN_DIR}_${user.id}-${plan.id}`;
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }

    const [userRecipes] = await this.recipeService.findAll({ uid: userUid }, unPaged, {
      ingredients: { ingredient: { nutrients: { nutrient: true } } }
    });

    userRecipes.map((recipe) => {
      recipe.ingredients.map(({ quantity, ingredient }) =>
        ingredient.nutrients.map(({ amount, nutrient }) => ({ [nutrient.id]: amount }))
      );
    });

    let pythonProcess: SpawnSyncReturns<Buffer>;
    try {
      pythonProcess = spawnSync('python3', ['/app/src/solver.py']);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    const result = pythonProcess.stdout?.toString()?.trim();
    const error = pythonProcess.stderr?.toString()?.trim();

    throw new Error();
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
