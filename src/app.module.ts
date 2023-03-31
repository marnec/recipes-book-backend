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
import { IngredientsModule } from './resources/ingredients/ingredients.module';
import { RecipeModule } from './resources/recipe/recipe.module';
import { UserModule } from './resources/user/user.module';
import { NutritionixModule } from './resources/nutritionix/nutritionix.module';
import { NutrientsModule } from './resources/nutrients/nutrients.module';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './auth/firebase-auth.strategy';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseJwtAuthGuard } from './auth/firebase-jwt,guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
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
    RecipeModule,
    IngredientsModule,
    NutritionixModule,
    NutrientsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FirebaseAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: FirebaseJwtAuthGuard
    }
  ],
  exports: [PassportModule]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
