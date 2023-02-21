import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { AuthHeartbeatService } from 'src/auth-heartbeat/auth-heartbeat.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class HeartBeatCronService implements OnModuleInit {
  private readonly logger = new Logger(HeartBeatCronService.name);

  heartAuthentication: { token: string; refreshToken: string } = {
    token: null,
    refreshToken: null
  };

  /** Cron default values never executes */
  cronTime = process.env.BACKEND_CRON_HEART_BEAT
    ? process.env.BACKEND_CRON_HEART_BEAT
    : '30 */5 * * * *';

  constructor(
    private authHeartbeatService: AuthHeartbeatService,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  onModuleInit() {
    this.addHeartBeatCronJob();
    if (process.env.ENABLE_BACKEND_CRON_HEART_BEAT === 'true') {
      // at the onModuleInit chron starts waiting so need to call it manually
      this.callHeartBeat();
    } else {
      this.stopHeartBeatCronJob();
    }
  }

  addHeartBeatCronJob() {
    const job = new CronJob(this.cronTime, () => {
      this.callHeartBeat();
    });
    this.schedulerRegistry.addCronJob('heart-beat', job);
    job.start();
  }

  stopHeartBeatCronJob() {
    const job = this.schedulerRegistry.getCronJob('heart-beat');
    job.stop();
  }

  callHeartBeat() {
    // send response for a user representing the backend instance
    const backendUser = new User();
    backendUser.username = 'backend';
    this.authHeartbeatService.headToHeartBeat(backendUser).then(
      () => {
        this.logger.debug(`Heart beat sent and received !!!`);
      },
      (err) => {
        this.logger.error(err);
      }
    );
  }
}
