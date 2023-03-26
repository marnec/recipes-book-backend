import { MigrationInterface, QueryRunner } from "typeorm";

export class addQtyToRecipeIngredients1679854204353 implements MigrationInterface {
    name = 'addQtyToRecipeIngredients1679854204353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" ADD "quantity" float`);
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" ADD "unit" varchar2(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" DROP COLUMN "quantity"`);
    }

}
