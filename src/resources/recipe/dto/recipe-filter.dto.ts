import { BasePaginatedFilterDto } from 'src/shared/base-paginated-filter.dto';

export class RecipeFilterDto extends BasePaginatedFilterDto {
  uid: string;
}
