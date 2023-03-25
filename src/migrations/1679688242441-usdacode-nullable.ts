import { MigrationInterface, QueryRunner } from "typeorm";

export class usdacodeNullable1679688242441 implements MigrationInterface {
    name = 'usdacodeNullable1679688242441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nutrients" MODIFY "usda_code" varchar2(255)  NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nutrients" MODIFY "usda_code" varchar2(255)  NOT NULL`);
    }

}
