import { MigrationInterface, QueryRunner } from "typeorm";

export class servingsNullable1679346035773 implements MigrationInterface {
    name = 'servingsNullable1679346035773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes" MODIFY "servings" number  NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes" MODIFY "servings" number  NOT NULL`);
    }

}
