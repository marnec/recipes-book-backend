import { HttpException } from '@nestjs/common';
import { ErrorCode } from './application-exceptions.enum';

export class ApplicationException extends HttpException {
  public message: string
  public code: string;
  public params: { [key: string]: any };

  constructor(msg: string, code: ErrorCode | string= ErrorCode.default, params: { [key: string]: any } = null, status = 500) {
    super(msg, status);
    this.message = msg;
    this.code = code;
    this.params = params;
  }

  getCode(): string {
    return this.code;
  }

} // ApplicationException
