import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RoleDto } from './role.dto';
import { LanguageDto } from './language.dto';

export class UserDto {
    
    @ApiProperty()
    id: string;
  
    @IsNotEmpty()
    @ApiProperty()
    username: string;
  
    @IsEmail()
    @IsOptional()
    @ApiProperty()
    email?: string;
  
    @IsString()
    @ApiProperty()
    @IsOptional()
    name?: string;
  
    @IsString()
    @IsOptional()
    @ApiProperty()
    surname?: string;
  
    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    enabled?: boolean;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  
    @IsOptional()
    salt: string;
  
    @ApiProperty()
    @ValidateNested()
    roles?: RoleDto[];
  
    @ApiProperty()
    @ValidateNested()
    language?: LanguageDto;
  }
  