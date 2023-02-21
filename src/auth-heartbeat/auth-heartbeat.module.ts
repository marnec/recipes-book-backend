import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthHeartbeatController } from './auth-heartbeat.controller';
import { AuthHeartbeatService } from './auth-heartbeat.service';
import { HeartBeatCronService } from './heartbeat-cron.service';

@Module({
  imports: [
    HttpModule.register({
      auth: {
        username: process.env.APP_NAME,
        password: process.env.CLIENT_SECRET
      }
    })
  ],
  controllers: [AuthHeartbeatController],
  providers: [AuthHeartbeatService, HeartBeatCronService]
})
export class AuthHeartbeatModule {}
