import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserFields1680202765453 implements MigrationInterface {
  name = 'addUserFields1680202765453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "gender" varchar2(1)`);
    await queryRunner.query(`ALTER TABLE "users" ADD "weight" float`);
    await queryRunner.query(`ALTER TABLE "users" ADD "height" float`);
    await queryRunner.query(`ALTER TABLE "users" ADD "age" number`);
    await queryRunner.query(`ALTER TABLE "users" ADD "activity_level" varchar2(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "activity_level"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "age"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "height"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "weight"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
  }
}
