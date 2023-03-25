import { MigrationInterface, QueryRunner } from "typeorm";

export class ingredientNutrientsCustomManyToMany1679697562065 implements MigrationInterface {
    name = 'ingredientNutrientsCustomManyToMany1679697562065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" DROP CONSTRAINT "FK_b0d1ed8487442e07b809d93a834"`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" DROP CONSTRAINT "FK_addc0027805fb61308271c1a477"`);
        await queryRunner.query(`DROP INDEX "IDX_addc0027805fb61308271c1a47"`);
        await queryRunner.query(`DROP INDEX "IDX_b0d1ed8487442e07b809d93a83"`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" ADD "amount" float NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" ADD CONSTRAINT "FK_b0d1ed8487442e07b809d93a834" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id")`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" ADD CONSTRAINT "FK_addc0027805fb61308271c1a477" FOREIGN KEY ("nutrient_id") REFERENCES "nutrients" ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" DROP CONSTRAINT "FK_addc0027805fb61308271c1a477"`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" DROP CONSTRAINT "FK_b0d1ed8487442e07b809d93a834"`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" DROP COLUMN "amount"`);
        await queryRunner.query(`CREATE INDEX "IDX_b0d1ed8487442e07b809d93a83" ON "ingredients_nutrients" ("ingredient_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_addc0027805fb61308271c1a47" ON "ingredients_nutrients" ("nutrient_id")`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" ADD CONSTRAINT "FK_addc0027805fb61308271c1a477" FOREIGN KEY ("nutrient_id") REFERENCES "nutrients" ("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" ADD CONSTRAINT "FK_b0d1ed8487442e07b809d93a834" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") ON DELETE CASCADE`);
    }

}
