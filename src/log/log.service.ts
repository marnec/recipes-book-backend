import { Injectable } from '@nestjs/common';
import { Log } from '../entities/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LogService {
  constructor(@InjectRepository(Log) private readonly logRepository: Repository<Log>) {}

  async insertLog(
    code: string,
    status: string,
    message: string,
    stack: string,
    reqBody: string,
    reqParams: string
  ): Promise<Log> {
    const log = {
      code: code,
      status: status,
      stack: stack,
      message: message,
      requestBody: reqBody,
      requestParams: reqParams
    };
    return this.logRepository.save(log);
  } // insertLog
}
