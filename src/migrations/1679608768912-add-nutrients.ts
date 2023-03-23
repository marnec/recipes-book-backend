import { MigrationInterface, QueryRunner } from "typeorm";

export class addNutrients1679608768912 implements MigrationInterface {
    name = 'addNutrients1679608768912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nutrients" ("id" varchar2(36), "external_id" number NOT NULL, "description" varchar2(255) NOT NULL, "usda_code" varchar2(255) NOT NULL, "usda_order" number NOT NULL, "fda_daily" number NOT NULL, "unit" varchar2(255) NOT NULL, CONSTRAINT "PK_05bf070f987b9f67ea7b5896855" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredients_nutrients" ("ingredient_id" varchar2(36) NOT NULL, "nutrient_id" varchar2(36) NOT NULL, CONSTRAINT "PK_308ccba3945db0b37497171a2ff" PRIMARY KEY ("ingredient_id", "nutrient_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b0d1ed8487442e07b809d93a83" ON "ingredients_nutrients" ("ingredient_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_addc0027805fb61308271c1a47" ON "ingredients_nutrients" ("nutrient_id")`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "external_id" number NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" ADD CONSTRAINT "FK_b0d1ed8487442e07b809d93a834" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" ADD CONSTRAINT "FK_addc0027805fb61308271c1a477" FOREIGN KEY ("nutrient_id") REFERENCES "nutrients" ("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" DROP CONSTRAINT "FK_addc0027805fb61308271c1a477"`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" DROP CONSTRAINT "FK_b0d1ed8487442e07b809d93a834"`);
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "external_id"`);
        await queryRunner.query(`DROP INDEX "IDX_addc0027805fb61308271c1a47"`);
        await queryRunner.query(`DROP INDEX "IDX_b0d1ed8487442e07b809d93a83"`);
        await queryRunner.query(`DROP TABLE "ingredients_nutrients"`);
        await queryRunner.query(`DROP TABLE "nutrients"`);
    }

}
