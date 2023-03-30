import { MigrationInterface, QueryRunner } from "typeorm";

export class addServingGrams1679939749580 implements MigrationInterface {
    name = 'addServingGrams1679939749580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "serving_grams" number`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "serving_grams"`);
    }

}
