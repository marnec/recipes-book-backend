import { MigrationInterface, QueryRunner } from "typeorm";

export class addRecipeTitle1679340802438 implements MigrationInterface {
    name = 'addRecipeTitle1679340802438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes" ADD "title" varchar2(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "title"`);
    }

}
