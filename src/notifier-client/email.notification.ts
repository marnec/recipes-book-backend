import { AbstractNotification } from './notification.abstract';
import { EmailNotificationDto } from './dto/email.dto';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Notification } from './notification.entity';
import { ServiceUnavailableException, Injectable, Inject } from '@nestjs/common';
import { NotifierClientConfigs } from './notifier-client.module';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EmailNotification extends AbstractNotification {
  // config: NotifierClientConfigs,
  constructor(@Inject('CONFIG_OPTIONS') config: NotifierClientConfigs, httpService: HttpService) {
    super(config, 'EMAIL', httpService);
  }

  /**
   * Valido i dati per da inviare
   * @param data dati da validare
   */
  protected validate(data: EmailNotificationDto): boolean {
    const schema = plainToClass(EmailNotificationDto, data);
    const check = validateSync(schema);
    if (check.length !== 0) {
      this.logger.debug(check.toString());
    }
    return check.length !== 0 ? false : true;
  }

  /**
   * Return a notification by id
   * @param {string} id Notification id
   * @returns {Promise<Notification>}
   */
  public get(id: string): Promise<Notification> {
    return this.getNotification(id).catch((err) => {
      throw new ServiceUnavailableException(err.message);
    });
  }

  /**
   * Send notification
   * @param {EmailNotificationDto} data data to send
   * @returns {Promise<any>}
   */
  public send(data: EmailNotificationDto): Promise<any> {
    // check if data is [] or not -> if [] send bulk  && Single validation
    return this.sendNotification(data);
  }
}
