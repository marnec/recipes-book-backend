import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { provideCustomRepository } from 'src/shared/provide-custom-repository';
import { Language } from './entities/language.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User, Language])],
  providers: [UserService, provideCustomRepository(User, UserRepository)],
  controllers: [UserController],
  exports: [UserService, UserRepository]
})
export class UserModule {}
