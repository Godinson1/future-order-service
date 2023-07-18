import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  entities: ['dist/**/*.entity.js'],
  subscribers: ['dist/**/*.subscriber.js'],
  logging: false,
  synchronize: false,
  migrations: ['dist/database/migrations/*.js'],
  replication: {
    master: {
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: `${process.env.PGDATABASE}${process.env.NODE_ENV.trim() == 'test' ? '_test' : ''}`,
    },
    slaves: [],
  },
});

export const AppDataSource = async (configService): Promise<TypeOrmModuleOptions> => {
  configService = configService;
  return {
    type: 'postgres',
    entities: ['dist/**/*.entity.js'],
    subscribers: ['dist/**/*.subscriber.js'],
    logging: false,
    synchronize: false,
    migrations: ['dist/database/migrations/*.js'],
    replication: {
      master: {
        host: configService.get('PGHOST'),
        port: configService.get('PGPORT'),
        username: configService.get('PGUSER'),
        password: configService.get('PGPASSWORD'),
        database: `${configService.get('PGDATABASE')}${
          process.env.NODE_ENV.trim() == 'test' ? '_test' : ''
        }`,
      },
      slaves: [],
    },
  };
};
