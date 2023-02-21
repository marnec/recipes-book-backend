import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { User } from "../entities/user.entity";

export class LanguageDto {
  id: string;

  @IsNotEmpty()
  code: string;

  @IsOptional()
  description?: string;

  @ValidateNested()
  users?: User[];

}