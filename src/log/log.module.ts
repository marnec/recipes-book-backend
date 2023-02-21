import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../entities/log.entity';
import { LogController } from './log.controller';

@Module({
  providers: [LogService],
  imports: [TypeOrmModule.forFeature([Log])],
  exports: [LogService],
  controllers: [LogController]
})
export class LogModule {}
