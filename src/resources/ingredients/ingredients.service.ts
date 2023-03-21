import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { env } from 'process';
import { map, Observable, tap } from 'rxjs';
import { NUTRITIONIX_API_URL } from 'src/shared/constant';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { IngredientsFilterDto } from './dto/ingredients-filter.dto';
import {
  CommonIngredientItem,
  IngredientSearchResult,
  SearchIngredientResult
} from './dto/search-ingredient-result.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { camelizeKeys } from 'fast-case';

const headers = {
  'Content-Type': 'application/json',
  'x-app-id': env.NUTRITIONIX_ID,
  'x-app-key': env.NUTRITIONIX_KEY
};

@Injectable()
export class IngredientsService {
  constructor(private http: HttpService) {}

  create(createIngredientDto: CreateIngredientDto) {
    return 'This action adds a new ingredient';
  }

  find(filter: IngredientsFilterDto): Observable<IngredientSearchResult[]> {
    return this.http
      .post<SearchIngredientResult>(`${NUTRITIONIX_API_URL}/v2/search/instant`, filter, {
        headers
      })
      .pipe(
        tap(console.log),
        map((res) => camelizeKeys(res.data.common) as IngredientSearchResult[])
      );
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
