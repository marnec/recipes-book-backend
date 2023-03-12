import {
  IsBoolean, IsEmail,
  IsNotEmpty, IsOptional, IsString
} from 'class-validator';

export class UpsertUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsString({each: true})
  roleIds: string[];

  @IsString()
  languageId?: string;
}
