import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import {
  PostgresErrorCode,
  isPostgresError,
} from '../../common/constants/db-code';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else {
        const body = exceptionResponse as { message?: string | string[]; error?: string };
        message = body?.message ?? exception.message;
        error = body?.error ?? exception.name;
      }
    } else if (exception instanceof QueryFailedError) {
      const {
        status: dbStatus,
        message: dbMessage,
        error: dbError,
      } = this.handleDatabaseError(exception);
      status = dbStatus;
      message = dbMessage;
      error = dbError;
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
      error = 'Not Found';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    this.logError(exception, request, status);

    const errorResponse: {
      statusCode: number;
      timestamp: string;
      path: string;
      method: string;
      error: string;
      message: string | string[];
      // stack is added in non-prod for visibility
      stack?: string;
    } = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    };

    if (process.env.NODE_ENV === 'production') {
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        errorResponse.message = 'Internal server error';
      }
    } else if (exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  private handleDatabaseError(error: QueryFailedError): {
    status: number;
    message: string;
    error: string;
  } {
    type PostgresDriverError = { code?: string; detail?: string; column?: string; constraint?: string };
    const driverError: PostgresDriverError = (error as unknown as { driverError?: PostgresDriverError }).driverError ?? (error as unknown as PostgresDriverError);

    if (driverError?.code && isPostgresError(driverError as unknown)) {
      switch (driverError.code) {
        case PostgresErrorCode.UNIQUE_VIOLATION:
          return {
            status: HttpStatus.CONFLICT,
            message: this.extractUniqueViolationMessage(error),
            error: 'Conflict',
          };

        case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Referenced resource does not exist',
            error: 'Bad Request',
          };

        case PostgresErrorCode.NOT_NULL_VIOLATION:
          return {
            status: HttpStatus.BAD_REQUEST,
            message: this.extractNotNullViolationMessage(error),
            error: 'Bad Request',
          };

        case PostgresErrorCode.CHECK_VIOLATION:
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'Data validation failed',
            error: 'Bad Request',
          };

        case PostgresErrorCode.EXCLUSION_VIOLATION:
          return {
            status: HttpStatus.CONFLICT,
            message: 'Data conflict detected',
            error: 'Conflict',
          };

        default:
          return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Database error occurred',
            error: 'Internal Server Error',
          };
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database error occurred',
      error: 'Internal Server Error',
    };
  }

  private extractUniqueViolationMessage(error: QueryFailedError): string {
    type PostgresDriverError = { detail?: string };
    const driverError: PostgresDriverError = (error as unknown as { driverError?: PostgresDriverError }).driverError ?? (error as unknown as PostgresDriverError);
    const detail = driverError?.detail;
    if (detail && typeof detail === 'string') {
      const match = detail.match(/Key \(([^)]+)\)=/);
      if (match && match[1]) {
        const field = match[1].replace(/_/g, ' ');
        return `${field} already exists`;
      }
    }
    return 'Resource already exists';
  }

  private extractNotNullViolationMessage(error: QueryFailedError): string {
    type PostgresDriverError = { column?: string };
    const driverError: PostgresDriverError = (error as unknown as { driverError?: PostgresDriverError }).driverError ?? (error as unknown as PostgresDriverError);
    const column = driverError?.column;
    if (column) {
      const fieldName = column.replace(/_/g, ' ');
      return `${fieldName} is required`;
    }
    return 'Required field is missing';
  }

  private logError(exception: unknown, request: Request, status: number): void {
    const base = `${request.method} ${request.url} - ${status}`;

    if (status >= 500) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(base, stack);
    } else {
      const detail = exception instanceof Error ? exception.message : String(exception);
      this.logger.warn(`${base} - ${detail}`);
    }
  }
}
