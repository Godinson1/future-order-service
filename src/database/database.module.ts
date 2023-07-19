import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ormOptions } from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(ormOptions as TypeOrmModuleOptions)],
})
export class DatabaseModule {}
