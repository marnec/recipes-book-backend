import { MigrationInterface, QueryRunner } from "typeorm";

export class init1678616875861 implements MigrationInterface {
    name = 'init1678616875861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "logs" ("id" varchar2(36), "code" varchar2(255), "status" varchar2(255) NOT NULL, "message" varchar2(4000) NOT NULL, "stack" varchar2(4000), "request_body" varchar2(4000), "request_params" varchar2(4000), "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipes" ("id" varchar2(36), "body" varchar2(8000) NOT NULL, CONSTRAINT "PK_8f09680a51bf3669c1598a21682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar2(36), "username" varchar2(255) NOT NULL, "email" varchar2(255), "name" varchar2(255), "surname" varchar2(255), "enabled" number DEFAULT 1 NOT NULL, "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "modified" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "language_id" varchar2(36), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username")`);
        await queryRunner.query(`CREATE TABLE "languages" ("id" varchar2(36), "code" varchar2(255) NOT NULL, "i18n" varchar2(255) NOT NULL, "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "modified" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7397752718d1c9eb873722ec9b" ON "languages" ("code")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0e58ae76fbd70ddec9f0713281" ON "languages" ("i18n")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_5467acf58b481907933d4eaf046" FOREIGN KEY ("language_id") REFERENCES "languages" ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5467acf58b481907933d4eaf046"`);
        await queryRunner.query(`DROP INDEX "IDX_0e58ae76fbd70ddec9f0713281"`);
        await queryRunner.query(`DROP INDEX "IDX_7397752718d1c9eb873722ec9b"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP INDEX "IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "recipes"`);
        await queryRunner.query(`DROP TABLE "logs"`);
    }

}
