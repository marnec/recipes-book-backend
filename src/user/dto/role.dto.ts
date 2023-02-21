import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { User } from "src/entities/user.entity";
export class RoleDto {
  @ApiProperty()
  id: string;

  @IsNotEmpty()
  @ApiProperty()
  code: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @ValidateNested()
  users?: User[];
}