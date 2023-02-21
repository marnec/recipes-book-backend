import {
  Body,
  Controller,
  Get,
  Logger,
  Param, Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entities/user.entity';
import { RoleGuard } from 'src/guard/role.guard';
import { Pageable } from 'src/shared/base-paginated-filter.dto';
import { ROLE_ADMIN_CODE } from 'src/shared/constant';
import { FilteredPaginatedQuery } from 'src/shared/filtered-query.decorator';
import { PaginatedResult } from 'src/shared/paginated-result.dto';
import { MailDto } from './dto/mail.dto';
import { UpsertUserDto } from './dto/upsert-user.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UserService } from './user.service';

@UseGuards(
  AuthGuard('jwt'),
  new RoleGuard([ROLE_ADMIN_CODE]) // only admin user can edit users
)
@Controller('user')
export class UserController {
  logger = new Logger(UserController.name);
  constructor(public service: UserService, private authService: AuthService) {}

  @Get('list')
  @FilteredPaginatedQuery<User>(User)
  async getUserList(
    @Query() userFilterDto: UserFilterDto,
    pageable: Pageable
  ): Promise<PaginatedResult<User>> {
    return this.service.getUserList(userFilterDto, pageable);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.service.getUser(id);
  }

  @Post()
  async insertUser(@Body(ValidationPipe) insertUserDto: UpsertUserDto): Promise<User> {
    return await this.service.insertUser(insertUserDto);
  }

  @Patch(':id')
  async editUser(
    @Param('id') userId: string,
    @Body(ValidationPipe) editUserDto: UpsertUserDto
  ): Promise<User> {
    return await this.service.editUser(userId, editUserDto);
  }

  @Post('email')
  async sendPasswordRecoveryEmail(@Body(ValidationPipe) mailDto: MailDto): Promise<boolean> {
    return this.authService.hanldeResetPasswordRequest(mailDto.email);
  }
}
