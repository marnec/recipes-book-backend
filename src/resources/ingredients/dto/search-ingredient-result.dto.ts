import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class SearchIngredientResult {
  common: CommonIngredientItem[];
}

export class CommonIngredientItem {
  food_name: string;

  serving_unit: string;

  tag_name: string;

  serving_qty: number;

  common_type: boolean | null;

  tag_id: number;

  photo: {
    thumb: string;
  };

  locale: string;
}

export interface IngredientSearchResult {
  foodName: string;

  servingUnit: string;

  tagName: string;

  servingQty: number;

  commonType: boolean | null;

  tagId: number;

  photo: {
    thumb: string;
  };

  locale: string;
}
