import { MigrationInterface, QueryRunner } from "typeorm";

export class recipeNutrients1683744710353 implements MigrationInterface {
    name = 'recipeNutrients1683744710353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipes_nutrients" ("recipe_id" varchar2(36) NOT NULL, "nutrient_id" varchar2(36) NOT NULL, "amount" float NOT NULL, CONSTRAINT "PK_51159967ce00e95599620e0294a" PRIMARY KEY ("recipe_id", "nutrient_id"))`);
        await queryRunner.query(`ALTER TABLE "recipes_nutrients" ADD CONSTRAINT "FK_7e496d03276da0c342c2ccd0664" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")`);
        await queryRunner.query(`ALTER TABLE "recipes_nutrients" ADD CONSTRAINT "FK_9edeecdde4528cae59314e01042" FOREIGN KEY ("nutrient_id") REFERENCES "nutrients" ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes_nutrients" DROP CONSTRAINT "FK_9edeecdde4528cae59314e01042"`);
        await queryRunner.query(`ALTER TABLE "recipes_nutrients" DROP CONSTRAINT "FK_7e496d03276da0c342c2ccd0664"`);
        await queryRunner.query(`DROP TABLE "recipes_nutrients"`);
    }

}
