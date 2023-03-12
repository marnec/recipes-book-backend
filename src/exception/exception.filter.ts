import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { pick } from 'radash';
import { LogService } from 'src/log/log.service';
import { ErrorMessage } from './application-exceptions.enum';
import { ApplicationException } from './application.exception';


@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = new Logger('GlobalExceptionFilter');

  constructor(private readonly systemLogService: LogService) {}

  private verboseLog(exception: Error, request: Request): void {
    if (exception instanceof HttpException && exception.getStatus() === 401) {
      return;
    }

    this.logger.error(exception?.stack || exception);

    try {
      const params = JSON.stringify(request.params, null, 2);
      const body = JSON.stringify(request.body, null, 2);
      this.logger.error(`Launched by request:
    Url: ${request.url}
    Params: ${params}
    Body: ${body}`);
    } catch (error) {
      this.logger.warn(error);
      this.logger.warn(`Error while parsing request in verbose log`);
    }
  }

 
  getCode(exception: any): string {
    return (exception?.getResponse() as any)?.code;
  }

  getMessage(exception: any): string {
    return (exception?.getResponse() as any)?.message;
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = exception?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = exception?.message || ErrorMessage.default;
    let code: string = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = this.getCode(exception);
      message = this.getMessage(exception);
    }

    this.verboseLog(exception, request);

    let error: ApplicationException;


    if (exception instanceof ApplicationException) {
      error = exception;
    } else {
      error = new ApplicationException(message, code, null, status);
    }

    response.status(status).json(pick(error, ['code', 'message', 'params']));
  }
} // GlobalExceptionFilter
