import { IngredientSearchResult } from 'src/resources/ingredients/dto/ingredients-search-results.dto';

export class AssociateIngredientDto {
  recipeId: string;
  ingredient: Partial<IngredientSearchResult>;
}

export class AssociateNewIngredientDto {
  recipeId: string;
  ingredientName: string;
}
