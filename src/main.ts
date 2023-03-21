import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { initializeApp, cert } from 'firebase-admin/app';
import { initializeTransactionalContext } from 'typeorm-transactional';
import 'reflect-metadata';
import { QueryExceptionFilter } from './exceptions/query-exception.filter';
import { HttpExceptionFilter } from './exceptions/http-exceptions.filter';

async function bootstrap() {
  initializeTransactionalContext();

  initializeApp({ credential: cert('./recipes-ac036-firebase-adminsdk-1mje6-a903c2c3df.json') });

  const port = 3000;
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useStaticAssets(join(__dirname, '..', 'public', 'assets'));

  app.enableCors({ origin: process.env.BACKEND_ORIGIN, methods: 'GET,PUT,POST,DELETE' });

  const devEnv = process.env.DEV_ENV === 'true';
  if (devEnv) {
    // Swagger doc options
    const options = new DocumentBuilder()
      .setTitle('')
      .setDescription('API')
      .setVersion('0.1')
      .addBearerAuth()
      .build();

    // Swagger creation
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('doc', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  const httpAdapter = app.get<HttpAdapterHost>(HttpAdapterHost);
  app.useGlobalFilters(new QueryExceptionFilter(httpAdapter), new HttpExceptionFilter());

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
