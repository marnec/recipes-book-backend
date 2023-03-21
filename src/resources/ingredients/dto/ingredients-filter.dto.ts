import { IsString } from 'class-validator';

export class IngredientsFilterDto {
  @IsString()
  query: string;

  @IsString()
  locale: string;

  branded = false;
  common = true;
  detailed = false;
}
