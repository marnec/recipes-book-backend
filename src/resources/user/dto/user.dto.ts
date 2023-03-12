import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { LanguageDto } from './language.dto';

export class UserDto {
    
    id: string;
  
    @IsNotEmpty()
    username: string;
  
    @IsEmail()
    @IsOptional()
    email?: string;
  
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsString()
    @IsOptional()
    surname?: string;
  
    @IsBoolean()
    @IsOptional()
    enabled?: boolean;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  
    @IsOptional()
    salt: string;
  
    @ValidateNested()
    @Type(() => LanguageDto)
    language?: LanguageDto;
  }
  