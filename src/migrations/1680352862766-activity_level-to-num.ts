import { MigrationInterface, QueryRunner } from "typeorm";

export class activityLevelToNum1680352862766 implements MigrationInterface {
    name = 'activityLevelToNum1680352862766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "activity_level"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "activity_level" number`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "activity_level"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "activity_level" varchar2(255)`);
    }

}
