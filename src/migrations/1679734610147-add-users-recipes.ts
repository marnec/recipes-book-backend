import { MigrationInterface, QueryRunner } from "typeorm";

export class addUsersRecipes1679734610147 implements MigrationInterface {
    name = 'addUsersRecipes1679734610147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_recipes" ("user_id" varchar2(36) NOT NULL, "recipe_id" varchar2(36) NOT NULL, "role" varchar2(255) NOT NULL, CONSTRAINT "PK_44bb8cf3fce936b77b68bb1e721" PRIMARY KEY ("user_id", "recipe_id"))`);
        await queryRunner.query(`ALTER TABLE "ingredients" MODIFY "unit" varchar2(255)  NULL`);
        await queryRunner.query(`ALTER TABLE "ingredients" MODIFY "external_id" number  NULL`);
        await queryRunner.query(`ALTER TABLE "users_recipes" ADD CONSTRAINT "FK_9b4ef82704d0446b13308f27ec9" FOREIGN KEY ("user_id") REFERENCES "users" ("id")`);
        await queryRunner.query(`ALTER TABLE "users_recipes" ADD CONSTRAINT "FK_208c6af95452ed761ed52701335" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_recipes" DROP CONSTRAINT "FK_208c6af95452ed761ed52701335"`);
        await queryRunner.query(`ALTER TABLE "users_recipes" DROP CONSTRAINT "FK_9b4ef82704d0446b13308f27ec9"`);
        await queryRunner.query(`ALTER TABLE "ingredients" MODIFY "external_id" number  NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ingredients" MODIFY "unit" varchar2(255)  NOT NULL`);
        await queryRunner.query(`DROP TABLE "users_recipes"`);
    }

}
