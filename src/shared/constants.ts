import { Pageable } from "./base-paginated-filter.dto";

export const NUTRITIONIX_API_URL = 'https://trackapi.nutritionix.com';

export const PLAN_DIR = 'plans';

export const baseEntitykeys = [
  'id',
  'save',
  'hasId',
  'recover',
  'reload',
  'remove',
  'softRemove'
] as const;

export const unPaged: Pageable = {
  order: null,
  skip: null,
  take: null
}

export const activityLevelBase = 1.2;
export const activityLevelStep = 0.175;
