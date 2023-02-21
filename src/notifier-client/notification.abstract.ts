import { ServiceUnavailableException } from '@nestjs/common';
import { NotifierClientConfigs } from './notifier-client.module';
import { Logger } from '@nestjs/common';
import { Notification } from './notification.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
interface NotificationRequest {
  readonly type: string;
  readonly app: string;
  notification: any;
}

export abstract class AbstractNotification {
  // Incapsulate HTTP_MODULE
  private type: string;
  private config: NotifierClientConfigs;
  protected logger: Logger;
  private message: NotificationRequest;

  private headers: Record<string, string>;

  constructor(
    config: NotifierClientConfigs,
    type: string,
    private readonly httpService: HttpService
  ) {
    this.logger = new Logger('Notifier-Client');
    this.config = config;
    this.type = type;

    this.message = {
      type: this.type,
      app: this.config.app,
      notification: null
    };

    this.headers = {
      Authorization: `Bearer ${this.config.token}`
    };
  }

  /**
   * Testing connection to the microservice
   * @returns {Promise<unknown>}
   */
  public testConnection(): Promise<AxiosResponse<any>> {
    const url = this.constructURL('api/alive');

    return lastValueFrom(this.httpService.get(url, { headers: this.headers }));
  }

  /**
   * Send new notification to the service
   * @param {any} data data to send
   * @returns {Promise<Notification>}
   */
  protected sendNotification(data: any): Promise<Notification> {
    if (!this.validate(data)) {
      this.logger.error(`Invalid email format`);
      this.logger.debug(JSON.stringify(data));
      throw new Error('invalid');
    }

    this.message.notification = data;
    const url = this.constructURL('notification');

    return lastValueFrom(
      this.httpService.post(url, this.message, {
        headers: this.headers
      })
    )
      .then((res: AxiosResponse<Notification>) => {
        return res.data;
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw new ServiceUnavailableException('Service not available');
      });
  }

  /**
   * TODO: TO IMPLEMENT
   * Send notifications in bulk
   * @param {any[]} data data to send
   * @returns {Promise<unknown>}
   */
  protected sendNotificationBulk(data: any[]): Promise<unknown> {
    return null;
  }

  /**
   * Get notification by id
   * @param {string} id ID of the notificaiton in queue
   * @returns {Promise<Notification>}
   */
  protected getNotification(id: string): Promise<Notification> {
    const url = this.constructURL(`notification/${id}`);

    return lastValueFrom(
      this.httpService.get(url, {
        headers: this.headers
      })
    )
      .then((res: AxiosResponse<Notification>) => {
        return res.data;
      })
      .catch((err) => {
        this.logger.error(err.message);
        throw new ServiceUnavailableException('Service not working');
      });
  }

  /**
   * Construct the url from config data
   * @param {string} request request to send
   * @returns {string}
   */
  private constructURL(request: string): string {
    const http = this.config.https ? 'https' : 'http';

    if (this.config.port) {
      this.config.host = this.config.host.replace(/\/(\w)?$/, '');
      const explode = this.config.host.split('/');

      if (explode.length > 0) {
        explode[0] = `${explode[0]}:${this.config.port}`;
        return `${http}://${explode.join('/')}/${request}`;
      }

      return `${http}://${this.config.host}:${this.config.port}/${request}`;
    }
    return `${http}://${this.config.host}/${request}`;
  }

  // concrete will implement this method for validation
  protected abstract validate(data: any): boolean;
}
