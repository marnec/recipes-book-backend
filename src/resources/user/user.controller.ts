import { Body, Controller, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
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

  @Post(':uid')
  async createUserIfNotExists(@Param('uid') uid: string): Promise<User> {
    return this.userService.createUserIfNotExists(uid);
  }

  @Put(':uid')
  async updateUser(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.userService.updateUser(uid, updateUserDto);
  }
}
