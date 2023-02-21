import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BasePaginatedFilterDto } from 'src/shared/base-paginated-filter.dto';

export class UserFilterDto extends BasePaginatedFilterDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  enabled?: boolean;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  languageIds?: string[];

  @IsOptional()
  roleIds?: string[];
}
