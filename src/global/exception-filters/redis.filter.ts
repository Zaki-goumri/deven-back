import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ReplyError } from 'ioredis';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
@Catch(ReplyError)
export class RedisExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: any, host: ArgumentsHost) {
    throw new Error('Method not implemented.');
  }
}
