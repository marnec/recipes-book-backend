import { Repository } from "typeorm";
import { Nutrient } from "./entities/nutrient.entity";

export class NutrientRepository extends Repository<Nutrient> {}