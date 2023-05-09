import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/resources/auth/auth.module';
import { provideCustomRepository } from 'src/shared/provide-custom-repository';
import { Language } from './entities/language.entity';
import { UserRecipe } from './entities/user-recipe.entity';
import { User } from './entities/user.entity';
import { UserRecipeRepository } from './user-recipe.repository';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserPlan } from './entities/user-plan.entity';
import { UserPlanRepository } from './user-plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Language, UserRecipe]), AuthModule, HttpModule],
  providers: [
    UserService,
    provideCustomRepository(User, UserRepository),
    provideCustomRepository(UserRecipe, UserRecipeRepository),
    provideCustomRepository(UserPlan, UserPlanRepository)
  ],
  controllers: [UserController],
  exports: [UserService, UserPlanRepository]
})
export class UserModule {}
