/* eslint-disable class-methods-use-this */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RequestContextMiddleware } from './custom-middleware/request-context.middleware';
import { config } from './ormconfig';
import { RoleModule } from './resources/role/role.module';

import { RecipeModule } from './resources/recipe/recipe.module';
import { UserModule } from './resources/user/user.module';

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
    AuthModule,
    ScheduleModule.forRoot(),
    UserModule,
    RoleModule,
    RecipeModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
