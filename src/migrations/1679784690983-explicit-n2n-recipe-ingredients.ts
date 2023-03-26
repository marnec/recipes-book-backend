import { MigrationInterface, QueryRunner } from "typeorm";

export class explicitN2nRecipeIngredients1679784690983 implements MigrationInterface {
    name = 'explicitN2nRecipeIngredients1679784690983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_38719bd7756e077181ceaf6e2b"`);
        await queryRunner.query(`DROP INDEX "IDX_aefbae9e2b77c3f192aff3bce2"`);
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" ADD "order" number NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" DROP COLUMN "order"`);
        await queryRunner.query(`CREATE INDEX "IDX_aefbae9e2b77c3f192aff3bce2" ON "recipes_ingredients" ("recipe_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_38719bd7756e077181ceaf6e2b" ON "recipes_ingredients" ("ingredient_id")`);
    }

}
