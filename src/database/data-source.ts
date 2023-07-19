import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const isTestEnv = process.env.NODE_ENV.trim() == 'test';
export const ormOptions = {
  type: 'postgres',
  entities: [isTestEnv ? __dirname + '/../**/*.entity.{js,ts}' : 'dist/**/*.entity.js'],
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
      database: `${process.env.PGDATABASE}${isTestEnv ? '_test' : ''}`,
    },
    slaves: [],
  },
};

export default new DataSource(ormOptions as DataSourceOptions);
