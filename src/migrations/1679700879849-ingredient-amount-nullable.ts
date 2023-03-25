import { MigrationInterface, QueryRunner } from "typeorm";

export class ingredientAmountNullable1679700879849 implements MigrationInterface {
    name = 'ingredientAmountNullable1679700879849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" MODIFY "amount" float  NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" MODIFY "amount" float  NOT NULL`);
    }

}
