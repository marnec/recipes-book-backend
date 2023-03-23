import { NutrientDto } from "src/resources/nutritionix/dto/nutrient.dto";

export interface IngredientFullNutrients {
  value: number;
  attrId: number;
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

    fullNutrients: IngredientFullNutrients[]
  }