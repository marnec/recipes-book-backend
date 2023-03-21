import { MigrationInterface, QueryRunner } from "typeorm";

export class addIngredients1679335978658 implements MigrationInterface {
    name = 'addIngredients1679335978658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" varchar2(36), "name" varchar2(200) NOT NULL, "set" number NOT NULL, "unit" varchar2(255) NOT NULL, "amount" float NOT NULL, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rec_ing_ing" ("recipesId" varchar2(36) NOT NULL, "ingredientsId" varchar2(36) NOT NULL, CONSTRAINT "PK_cea8641b235d6f569012f34d405" PRIMARY KEY ("recipesId", "ingredientsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_672019152f9f53c05a594f5abf" ON "rec_ing_ing" ("recipesId")`);
        await queryRunner.query(`CREATE INDEX "IDX_41395ea47c960f8fe228d7f1fd" ON "rec_ing_ing" ("ingredientsId")`);
        await queryRunner.query(`ALTER TABLE "recipes" ADD "servings" number NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rec_ing_ing" ADD CONSTRAINT "FK_672019152f9f53c05a594f5abf3" FOREIGN KEY ("recipesId") REFERENCES "recipes" ("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rec_ing_ing" ADD CONSTRAINT "FK_41395ea47c960f8fe228d7f1fd2" FOREIGN KEY ("ingredientsId") REFERENCES "ingredients" ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rec_ing_ing" DROP CONSTRAINT "FK_41395ea47c960f8fe228d7f1fd2"`);
        await queryRunner.query(`ALTER TABLE "rec_ing_ing" DROP CONSTRAINT "FK_672019152f9f53c05a594f5abf3"`);
        await queryRunner.query(`ALTER TABLE "recipes" DROP COLUMN "servings"`);
        await queryRunner.query(`DROP INDEX "IDX_41395ea47c960f8fe228d7f1fd"`);
        await queryRunner.query(`DROP INDEX "IDX_672019152f9f53c05a594f5abf"`);
        await queryRunner.query(`DROP TABLE "rec_ing_ing"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
    }

}
