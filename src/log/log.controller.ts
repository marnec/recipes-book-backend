import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Log } from '../entities/log.entity';
import { LogService } from './log.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('log')
export class LogController {
  constructor(private service: LogService) {}

  @Post()
  async insert(@Body(ValidationPipe) log: Log): Promise<Log> {
      return await this.service.insertLog(
        log.code,
        log.status,
        log.message,
        log.stack,
        log.requestBody,
        log.requestParams
      );
  }
} // SysLogController
