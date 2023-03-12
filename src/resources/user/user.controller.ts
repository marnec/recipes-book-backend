import {
  Controller,
  Get, Logger,
  Param
} from '@nestjs/common';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
  logger = new Logger(UserController.name);
  constructor(public service: UserService, private authService: AuthService) {}

  @Get(':uid')
  async userExists(@Param('uid') uid: string): Promise<UserRecord> {
    return getAuth().getUser(uid);
  }
}
