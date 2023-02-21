import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';


export const config: TypeOrmModuleOptions = {
  type: process.env.CONNECTION as any,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  connectString: process.env.CONNECTION_STRING,
  entities: [join(__dirname, '/**/**.entity{.ts,.js}')],
  synchronize: false,
  extra: { trustServerCertificate: true },
  // logging: ['query'],
  migrations:
    process.env.LAUNCH_MIGRATION_CUSTOM === 'true'
      ? [
          join(__dirname, '/migrations/*{.js,.ts}'),
          join(__dirname, '/migrations-custom/*{.js,.ts}')
        ]
      : [join(__dirname, '/migrations/*{.js,.ts}'), join(__dirname, '/migrations-test/*{.js,.ts}')],
  // cli: {
  //   migrationsDir: 'src/migrations'
  // },
  autoLoadEntities: true
};



export const dataSource = new DataSource({
  type: config.type,
  username: config.username,
  password: process.env.DB_PASSWORD,
  schema: config.schema,
  synchronize: config.synchronize,
  connectString: config.connectString,
  extra: config.extra,
  entities: ['/app/dist/**/**.entity{.ts,.js}'],
  migrations:
    process.env.LAUNCH_MIGRATION_CUSTOM === 'true' // In ambiente di produzione vengono lanciate le migration per i dati custom
      ? [
          join(__dirname, '/migrations/*{.js,.ts}'),
          join(__dirname, '/migrations-custom/*{.js,.ts}')
        ]
      : [join(__dirname, '/migrations/*{.js,.ts}'), join(__dirname, '/migrations-test/*{.js,.ts}')]
});
