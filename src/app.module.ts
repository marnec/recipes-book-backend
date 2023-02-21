/* eslint-disable class-methods-use-this */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthHeartbeatModule } from './auth-heartbeat/auth-heartbeat.module';
import { AuthModule } from './auth/auth.module';
import { RequestContextMiddleware } from './custom-middleware/request-context.middleware';
import { NotifierClientModule } from './notifier-client/notifier-client.module';
import { config } from './ormconfig';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return config;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      }
    }),
    NotifierClientModule.register({
      host: process.env.NOTIFIER_URL,
      port: parseInt(process.env.NOTIFIER_PORT, 10),
      app: process.env.NOTIFIER_APP,
      https: process.env.NOTIFIER_HTTPS === 'true',
      httpOptions: {
        timeout: 5000,
        maxRedirects: 3
      },
      token: process.env.NOTIFIER_TOKEN
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
        // add this to enable live translations
        watch: true
      }
    }),
    AuthModule,
    ScheduleModule.forRoot(),
    UserModule,
    RoleModule,
      AuthHeartbeatModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
