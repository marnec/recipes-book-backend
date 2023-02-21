import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthHeartbeatService {
  constructor(private httpService: HttpService) {}

  /**
   *
   * @param {User} user
   * @returns {Promise<any>}
   */
  async token(user: User): Promise<any> {
    return firstValueFrom(
      this.httpService.post(process.env.PATH_HEART_BEAT + 'v2/auth/token', {
        tenant: process.env.TENANT_NAME,
        appName: process.env.APP_NAME,
        clientId: user.username
      })
    );
  }

  /**
   *
   * @param {User} user
   * @returns {Promise<any>}
   */
  async headToHeartBeat(user: User): Promise<any> {
    return firstValueFrom(
      this.httpService.head(process.env.PATH_HEART_BEAT + 'v2/awms/beat-server', {
        headers: {
          'x-heartbeat-tenant': process.env.TENANT_NAME,
          'x-heartbeat-appname': process.env.APP_NAME,
          'x-heartbeat-client': user.username
        }
      })
    );
  }

  /**
   *
   * @param {string} refreshToken
   * @returns Return
   */
  async refresh(refreshToken: string): Promise<any> {
    return firstValueFrom(
      this.httpService.post(process.env.PATH_HEART_BEAT + 'v2/auth/refresh', {
        refreshToken: refreshToken
      })
    );
  }
}
