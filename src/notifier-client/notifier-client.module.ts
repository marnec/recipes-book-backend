import { HttpModule } from '@nestjs/axios';
import { Module, DynamicModule, HttpModuleOptions } from '@nestjs/common';
import { EmailNotification } from './email.notification';

export interface NotifierClientConfigs {
  /**
   * Address of the Notifier Service
   */
  host: string;

  /**
   * Host port
   */
  port: number;

  /**
   * Auth token to send with the request
   */
  token: string;

  /**
   * APP name who request the service
   */
  app: string;

  /**
   * ! feature to implement !
   * Flag, if true save the request on db
   */
  save?: boolean;
  /**
   * if true use https
   */
  https?: boolean;

  /**
   * HttpOptions
   */
  httpOptions: HttpModuleOptions;
}

@Module({})
export class NotifierClientModule {
  static register(config: NotifierClientConfigs): DynamicModule {
    return {
      module: NotifierClientModule,
      providers: [
        EmailNotification,
        {
          provide: 'CONFIG_OPTIONS',
          useValue: config
        }
      ],
      imports: [HttpModule.register(config.httpOptions)],
      exports: [EmailNotification]
    };
  }
}
