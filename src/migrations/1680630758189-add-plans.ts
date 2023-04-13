import { MigrationInterface, QueryRunner } from "typeorm";

export class addPlans1680630758189 implements MigrationInterface {
    name = 'addPlans1680630758189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plans_recipes" ("plan_id" varchar2(36) NOT NULL, "recipe_id" varchar2(36) NOT NULL, CONSTRAINT "PK_c03649add4448ef4d4c8fdc8bab" PRIMARY KEY ("plan_id", "recipe_id"))`);
        await queryRunner.query(`CREATE TABLE "plans" ("id" varchar2(36), CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_plans" ("plan_id" varchar2(36) NOT NULL, "user_id" varchar2(36) NOT NULL, CONSTRAINT "PK_176e6b545df6a73bc0f537fa5f6" PRIMARY KEY ("plan_id", "user_id"))`);
        await queryRunner.query(`ALTER TABLE "plans_recipes" ADD CONSTRAINT "FK_73ba93077e8232e6ced6883e393" FOREIGN KEY ("plan_id") REFERENCES "plans" ("id")`);
        await queryRunner.query(`ALTER TABLE "plans_recipes" ADD CONSTRAINT "FK_84b9c8136d0453bd85502055bde" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")`);
        await queryRunner.query(`ALTER TABLE "users_plans" ADD CONSTRAINT "FK_56809222b2e55ab4e12c28f9915" FOREIGN KEY ("plan_id") REFERENCES "plans" ("id")`);
        await queryRunner.query(`ALTER TABLE "users_plans" ADD CONSTRAINT "FK_0d68633c9c17c234eb4c09382ad" FOREIGN KEY ("user_id") REFERENCES "users" ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_plans" DROP CONSTRAINT "FK_0d68633c9c17c234eb4c09382ad"`);
        await queryRunner.query(`ALTER TABLE "users_plans" DROP CONSTRAINT "FK_56809222b2e55ab4e12c28f9915"`);
        await queryRunner.query(`ALTER TABLE "plans_recipes" DROP CONSTRAINT "FK_84b9c8136d0453bd85502055bde"`);
        await queryRunner.query(`ALTER TABLE "plans_recipes" DROP CONSTRAINT "FK_73ba93077e8232e6ced6883e393"`);
        await queryRunner.query(`DROP TABLE "users_plans"`);
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`DROP TABLE "plans_recipes"`);
    }

}
