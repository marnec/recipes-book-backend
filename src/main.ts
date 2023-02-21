import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exception/exception.filter';

import 'reflect-metadata';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import { LogService } from './log/log.service';
import { dataSource } from './ormconfig';

async function bootstrap() {
  /**
   * ? from the important notes of cls-hooked library:
   * Calling initializeTransactionalContext and patchTypeORMRepositoryWithBaseRepository
   * must happen BEFORE any application context is initialized!
   */
  initializeTransactionalContext();


  // NODE_END per controllare in che ambiente siamo
  // La prioritá viene sempre data alla variabile di sistema in questo
  // modo e poi alla configurazione

  const port = 3000;
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  // Init statics paths
  app.useStaticAssets(join(__dirname, '..', 'public', 'assets'));

  // Enable CORS.
  // DA CONFIGURARE CORRETTAMENTE IN PRODUZIONE
  app.enableCors();

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

  // Enable pipe
  app.useGlobalPipes(
    new ValidationPipe({
      // quando in produzione attivare
      // disableErrorMessages: true,
      //   whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  const logService = app.get(LogService);
  app.useGlobalFilters(new GlobalExceptionFilter(logService));

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
