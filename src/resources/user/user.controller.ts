import {
  Controller,
  Get, Logger,
  Param
} from '@nestjs/common';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
  logger = new Logger(UserController.name);
  constructor(public userService: UserService) {}

  @Get(':uid')
  async upsertUser(@Param('uid') uid: string) {
    return this.userService.upsertUser(uid);
  }
}
