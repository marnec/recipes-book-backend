import { MigrationInterface, QueryRunner } from "typeorm";

export class fdadailyNullable1679688184261 implements MigrationInterface {
    name = 'fdadailyNullable1679688184261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nutrients" MODIFY "fda_daily" number  NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nutrients" MODIFY "fda_daily" number  NOT NULL`);
    }

}
