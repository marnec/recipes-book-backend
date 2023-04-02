import { MigrationInterface, QueryRunner } from "typeorm";

export class init1680349315827 implements MigrationInterface {
    name = 'init1680349315827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nutrients" ("id" varchar2(36), "external_id" number NOT NULL, "description" varchar2(255), "usda_code" varchar2(255), "usda_order" number, "fda_daily" number, "unit" varchar2(255) NOT NULL, CONSTRAINT "PK_05bf070f987b9f67ea7b5896855" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "languages" ("id" varchar2(36), "code" varchar2(255) NOT NULL, "i18n" varchar2(255) NOT NULL, "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "modified" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7397752718d1c9eb873722ec9b" ON "languages" ("code")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0e58ae76fbd70ddec9f0713281" ON "languages" ("i18n")`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar2(36), "uid" varchar2(255) NOT NULL, "email" varchar2(255), "username" varchar2(255), "avatar" varchar2(8000) NOT NULL, "gender" varchar2(1), "weight" float, "height" float, "age" number, "activity_level" varchar2(255), "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "modified" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "language_id" varchar2(36), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_recipes" ("user_id" varchar2(36) NOT NULL, "recipe_id" varchar2(36) NOT NULL, "role" varchar2(255) NOT NULL, CONSTRAINT "PK_44bb8cf3fce936b77b68bb1e721" PRIMARY KEY ("user_id", "recipe_id"))`);
        await queryRunner.query(`CREATE TABLE "recipes" ("id" varchar2(36), "title" varchar2(255), "body" varchar2(8000), "servings" number, CONSTRAINT "PK_8f09680a51bf3669c1598a21682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipes_ingredients" ("recipe_id" varchar2(36) NOT NULL, "ingredient_id" varchar2(36) NOT NULL, "order" number NOT NULL, "quantity" float, "unit" varchar2(255), CONSTRAINT "PK_24c8cb193715ec048e92179eb65" PRIMARY KEY ("recipe_id", "ingredient_id"))`);
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" varchar2(36), "name" varchar2(200) NOT NULL, "set" number NOT NULL, "unit" varchar2(255), "amount" float, "serving_grams" number, "external_id" number, "nutrients_source_id" number, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredients_nutrients" ("ingredient_id" varchar2(36) NOT NULL, "nutrient_id" varchar2(36) NOT NULL, "amount" float NOT NULL, CONSTRAINT "PK_308ccba3945db0b37497171a2ff" PRIMARY KEY ("ingredient_id", "nutrient_id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_5467acf58b481907933d4eaf046" FOREIGN KEY ("language_id") REFERENCES "languages" ("id")`);
        await queryRunner.query(`ALTER TABLE "users_recipes" ADD CONSTRAINT "FK_9b4ef82704d0446b13308f27ec9" FOREIGN KEY ("user_id") REFERENCES "users" ("id")`);
        await queryRunner.query(`ALTER TABLE "users_recipes" ADD CONSTRAINT "FK_208c6af95452ed761ed52701335" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")`);
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "FK_aefbae9e2b77c3f192aff3bce2d" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")`);
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" ADD CONSTRAINT "FK_38719bd7756e077181ceaf6e2ba" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id")`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" ADD CONSTRAINT "FK_b0d1ed8487442e07b809d93a834" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id")`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" ADD CONSTRAINT "FK_addc0027805fb61308271c1a477" FOREIGN KEY ("nutrient_id") REFERENCES "nutrients" ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" DROP CONSTRAINT "FK_addc0027805fb61308271c1a477"`);
        await queryRunner.query(`ALTER TABLE "ingredients_nutrients" DROP CONSTRAINT "FK_b0d1ed8487442e07b809d93a834"`);
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" DROP CONSTRAINT "FK_38719bd7756e077181ceaf6e2ba"`);
        await queryRunner.query(`ALTER TABLE "recipes_ingredients" DROP CONSTRAINT "FK_aefbae9e2b77c3f192aff3bce2d"`);
        await queryRunner.query(`ALTER TABLE "users_recipes" DROP CONSTRAINT "FK_208c6af95452ed761ed52701335"`);
        await queryRunner.query(`ALTER TABLE "users_recipes" DROP CONSTRAINT "FK_9b4ef82704d0446b13308f27ec9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5467acf58b481907933d4eaf046"`);
        await queryRunner.query(`DROP TABLE "ingredients_nutrients"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
        await queryRunner.query(`DROP TABLE "recipes_ingredients"`);
        await queryRunner.query(`DROP TABLE "recipes"`);
        await queryRunner.query(`DROP TABLE "users_recipes"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "IDX_0e58ae76fbd70ddec9f0713281"`);
        await queryRunner.query(`DROP INDEX "IDX_7397752718d1c9eb873722ec9b"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP TABLE "nutrients"`);
    }

}
