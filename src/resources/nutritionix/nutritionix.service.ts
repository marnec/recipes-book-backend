import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { camelizeKeys } from 'fast-case';
import { env } from 'process';
import { objectify } from 'radash';
import { BehaviorSubject, first, map, Observable, tap } from 'rxjs';
import { IngredientsFilterDto } from 'src/resources/ingredients/dto/ingredients-filter.dto';

import { NUTRITIONIX_API_URL } from 'src/shared/constants';
import { IngredientSearchResult } from '../ingredients/dto/ingredients-search-results.dto';
import { NutrientDto, NutritionixNutrient } from './dto/nutrient.dto';
import { NutritionixIngredientSearchResult } from './dto/search-ingredient.dto';

export type NutrientMap = Record<number, NutrientDto>;

const headers = {
  'Content-Type': 'application/json',
  'x-app-id': env.NUTRITIONIX_ID,
  'x-app-key': env.NUTRITIONIX_KEY
};

@Injectable()
export class NutritionixService {
  constructor(private http: HttpService) {
    this.getNutrients().pipe(first()).subscribe();
  }

  nutrientsMap$ = new BehaviorSubject<NutrientMap>(null);

  searchIngredient(filter: IngredientsFilterDto): Observable<IngredientSearchResult[]> {
    return this.http
      .post<NutritionixIngredientSearchResult>(`${NUTRITIONIX_API_URL}/v2/search/instant`, filter, {
        headers
      })
      .pipe(map((res) => camelizeKeys(res.data.common) as IngredientSearchResult[]));
  }

  getNutrients(): Observable<NutrientDto[]> {
    return this.http
      .get<NutritionixNutrient[]>(`${NUTRITIONIX_API_URL}/v2/utils/nutrients`, { headers })
      .pipe(
        map((res) => camelizeKeys(res.data) as NutrientDto[]),
        tap((nutrients) => {
          this.nutrientsMap$.next(objectify(nutrients, (n) => n.attrId));
        })
      );
  }
}
