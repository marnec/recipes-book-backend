import { MigrationInterface, QueryRunner } from "typeorm";

export class addRecipes1677009069391 implements MigrationInterface {
    name = 'addRecipes1677009069391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipes" ("id" varchar2(36), "body" varchar2(8000) NOT NULL, CONSTRAINT "PK_8f09680a51bf3669c1598a21682" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "recipes"`);
    }

}
