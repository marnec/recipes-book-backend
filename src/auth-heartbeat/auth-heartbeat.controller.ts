import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { GetUser } from 'src/shared/get-user.decorator';
import { AuthHeartbeatService } from './auth-heartbeat.service';

@Controller('auth-heartbeat')
@UseGuards(AuthGuard('jwt'))
export class AuthHeartbeatController {
  logger = new Logger('AuthHeartbeatController');

  constructor(private authHeartbeatService: AuthHeartbeatService) {}

  @Post('token')
  async token(@GetUser() user: User): Promise<any> {
    return (await this.authHeartbeatService.token(user)).data;
  }

  @Post('refr3sh')
  async refresh(@Body('refreshToken') refreshToken: string): Promise<any> {
    return (await this.authHeartbeatService.refresh(refreshToken)).data;
  }
}
