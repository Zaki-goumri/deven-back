import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { RedisExceptionFilter } from './redis.filter';
import { DatabaseExceptionFilter } from './db.filter';
import { GlobalExceptionFilter } from './logger.filter';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: RedisExceptionFilter },
    { provide: APP_FILTER, useClass: DatabaseExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class FiltersModule {}
