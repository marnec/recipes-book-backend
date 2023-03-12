import { Module } from '@nestjs/common';
import { LogModule } from 'src/log/log.module';
import { UserModule } from 'src/resources/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
require('dotenv').config();

@Module({
  imports: [UserModule, LogModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
