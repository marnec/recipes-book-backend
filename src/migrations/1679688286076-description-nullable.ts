import { MigrationInterface, QueryRunner } from "typeorm";

export class descriptionNullable1679688286076 implements MigrationInterface {
    name = 'descriptionNullable1679688286076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nutrients" MODIFY "description" varchar2(255)  NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nutrients" MODIFY "description" varchar2(255)  NOT NULL`);
    }

}
