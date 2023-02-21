import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsArray,
  IsBoolean
} from 'class-validator';

@Expose()
export class EmailNotificationDto {
  @IsNotEmpty()
  @IsArray()
  @IsEmail({}, { each: true })
  @Type(() => String)
  to: string[];

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  @Type(() => String)
  cc: string[];

  /**
   * Default email del server di posta che invia
   */
  @IsEmail()
  @IsOptional()
  from: string;

  @IsString()
  @MaxLength(120)
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  @Transform((value) => !!value)
  fake = false;
}
