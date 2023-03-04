import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exception/exception.filter';

import { initializeApp, cert } from 'firebase-admin/app';
import 'reflect-metadata';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { LogService } from './log/log.service';

async function bootstrap() {
  /**
   * ? from the important notes of cls-hooked library:
   * Calling initializeTransactionalContext and patchTypeORMRepositoryWithBaseRepository
   * must happen BEFORE any application context is initialized!
   */
  initializeTransactionalContext();


  // const firebaseConfig = {
  //   apiKey: "AIzaSyBKCgzrncsKImMBbPq7x2EBKi5SaMA3Lks",
  //   authDomain: "recipes-ac036.firebaseapp.com",
  //   projectId: "recipes-ac036",
  //   storageBucket: "recipes-ac036.appspot.com",
  //   messagingSenderId: "320224370121",
  //   appId: "1:320224370121:web:52fd8c7dbca4550c049c18",
  //   measurementId: "G-ND7VKS1HCE"
  // };

  initializeApp({credential: cert('./recipes-ac036-firebase-adminsdk-1mje6-a903c2c3df.json')});

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
