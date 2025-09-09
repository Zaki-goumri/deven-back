import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const timestamp = new Date().toISOString();
    const errorLog = `${timestamp} ERROR: ${request.method} ${request.url} ${status}`;
    this.logger.warn(request.headers);
    this.logger.log(request.body);
    this.logger.error(errorLog);
    // throw the error
    response.status(status).json({
      //eslint-disable-next-line
      ...exception.response,
    });
  }
}
