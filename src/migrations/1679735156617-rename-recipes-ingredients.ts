import { MigrationInterface, QueryRunner } from "typeorm";

export class renameRecipesIngredients1679735156617 implements MigrationInterface {
    name = 'renameRecipesIngredients1679735156617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipes_ingredients" ("recipe_id" varchar2(36) NOT NULL, "ingredient_id" varchar2(36) NOT NULL, CONSTRAINT "PK_24c8cb193715ec048e92179eb65" PRIMARY KEY ("recipe_id", "ingredient_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aefbae9e2b77c3f192aff3bce2" ON "recipes_ingredients" ("recipe_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_38719bd7756e077181ceaf6e2b" ON "recipes_ingredients" ("ingredient_id")`);
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "FK_aefbae9e2b77c3f192aff3bce2d" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "FK_38719bd7756e077181ceaf6e2ba" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id")`);
        await queryRunner.query(`DROP INDEX "IDX_41395ea47c960f8fe228d7f1fd"`);
        await queryRunner.query(`DROP INDEX "IDX_672019152f9f53c05a594f5abf"`);
        await queryRunner.query(`DROP TABLE "rec_ing_ing"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" DROP CONSTRAINT "FK_38719bd7756e077181ceaf6e2ba"`);
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" DROP CONSTRAINT "FK_aefbae9e2b77c3f192aff3bce2d"`);
        await queryRunner.query(`DROP INDEX "IDX_38719bd7756e077181ceaf6e2b"`);
        await queryRunner.query(`DROP INDEX "IDX_aefbae9e2b77c3f192aff3bce2"`);
        await queryRunner.query(`DROP TABLE "recipes_ingredients"`);
        await queryRunner.query(`CREATE TABLE "rec_ing_ing" ("recipesId" varchar2(36) NOT NULL, "ingredientsId" varchar2(36) NOT NULL, CONSTRAINT "PK_cea8641b235d6f569012f34d405" PRIMARY KEY ("recipesId", "ingredientsId"))`);
        await queryRunner.query(`ALTER TABLE "rec_ing_ing" ADD CONSTRAINT "FK_672019152f9f53c05a594f5abf3" FOREIGN KEY ("recipesId") REFERENCES "recipes" ("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rec_ing_ing" ADD CONSTRAINT "FK_41395ea47c960f8fe228d7f1fd2" FOREIGN KEY ("ingredientsId") REFERENCES "ingredients" ("id")`);
    }

}
