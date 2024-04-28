import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const message = exception.message; // Accessing the message property of the exception
    const exceptionResponseMessage = (exception.getResponse() as any)?.message;
    if (
      exception instanceof HttpException &&
      exceptionResponseMessage instanceof Array
    ) {
      const validationErrors = exceptionResponseMessage as ValidationError[];

      // Check if it's an instance of class-validation ValidationError
      if (validationErrors.every((error) => error instanceof ValidationError)) {
        // Do something specific for class-validation errors
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: 'Validation failed', // Custom message for validation errors
          errors: validationErrors.reduce(
            (acc, error) => ({
              ...acc,
              [error.property]: Object.values(error.constraints),
            }),
            {},
          ),
        });
        return;
      }
    }

    // Handle other types of exceptions
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
