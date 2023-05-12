import { IngredientNutrient } from 'src/resources/ingredients/entities/ingredient_nutrients.entity';
import { RecipeNutrient } from 'src/resources/recipe/entities/recipe-nutrient.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'nutrients' })
export class Nutrient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', name: 'external_id' })
  externalId: number;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', name: 'usda_code', nullable: true })
  usdaCode: string;

  @Column({ type: 'int', name: 'usda_order', nullable: true })
  usdaOrder: number;

  @Column({ type: 'int', name: 'fda_daily', nullable: true })
  fdaDaily: number;

  @Column({ type: 'varchar' })
  unit: string;
  
  @OneToMany(() => IngredientNutrient, (nutrientIngredients) => nutrientIngredients.nutrient)
  nutrientIngredients: IngredientNutrient[]

  @OneToMany(() => RecipeNutrient, (nutrientRecipes) => nutrientRecipes.nutrient)
  nutrientRecipes: RecipeNutrient[]
}
