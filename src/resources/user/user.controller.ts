import {
  Controller,
  Get, Logger,
  Param,
  Put
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
  logger = new Logger(UserController.name);
  constructor(public userService: UserService) {}

  @Get(':uid')
  async getSelf(@Param('uid') uid: string): Promise<User> {
    return this.userService.getByUid(uid);
  }
  @Put(':uid')
  async upsertUser(@Param('uid') uid: string): Promise<User> {
    return this.userService.upsertUser(uid);
  }
}
