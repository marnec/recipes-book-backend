import { MigrationInterface, QueryRunner } from "typeorm";

export class usdaorderNullable1679688336922 implements MigrationInterface {
    name = 'usdaorderNullable1679688336922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nutrients" MODIFY "usda_order" number  NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nutrients" MODIFY "usda_order" number  NOT NULL`);
    }

}
