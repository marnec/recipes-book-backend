import { Repository } from 'typeorm';
import { UserRecipe } from './entities/user-recipe.entity';
import { User } from './entities/user.entity';

export class UserRecipeRepository extends Repository<UserRecipe> {}
