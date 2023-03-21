import { MigrationInterface, QueryRunner } from "typeorm";

export class recipeNullable1679343273492 implements MigrationInterface {
    name = 'recipeNullable1679343273492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes" MODIFY "title" varchar2(255)  NULL`);
        await queryRunner.query(`ALTER TABLE "recipes" MODIFY "body" varchar2(8000)  NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes" MODIFY "body" varchar2(8000)  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recipes" MODIFY "title" varchar2(255)  NOT NULL`);
    }

}
