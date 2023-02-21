import { MigrationInterface, QueryRunner } from "typeorm";

export class init1676749515509 implements MigrationInterface {
    name = 'init1676749515509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "languages" ("id" varchar2(36), "code" varchar2(255) NOT NULL, "i18n" varchar2(255) NOT NULL, "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "modified" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7397752718d1c9eb873722ec9b" ON "languages" ("code")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0e58ae76fbd70ddec9f0713281" ON "languages" ("i18n")`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" varchar2(36), "code" varchar2(255) NOT NULL, "description" varchar2(255), "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "modified" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f6d54f95c31b73fb1bdd8e91d0" ON "roles" ("code")`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar2(36), "username" varchar2(255) NOT NULL, "email" varchar2(255), "name" varchar2(255), "surname" varchar2(255), "enabled" number DEFAULT 1 NOT NULL, "password" varchar2(255) NOT NULL, "salt" varchar2(255), "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "modified" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "language_id" varchar2(36), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username")`);
        await queryRunner.query(`CREATE TABLE "password_reset_requests" ("id" varchar2(36), "token" varchar2(255) NOT NULL, "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "fulfilled" number DEFAULT 0 NOT NULL, "userId" varchar2(36), CONSTRAINT "PK_4aa83fc224280f3c94c3e214d65" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "logs" ("id" varchar2(36), "code" varchar2(255), "status" varchar2(255) NOT NULL, "message" varchar2(4000) NOT NULL, "stack" varchar2(4000), "request_body" varchar2(4000), "request_params" varchar2(4000), "created" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_roles" ("user_id" varchar2(36) NOT NULL, "role_id" varchar2(36) NOT NULL, CONSTRAINT "PK_c525e9373d63035b9919e578a9c" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles" ("role_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_5467acf58b481907933d4eaf046" FOREIGN KEY ("language_id") REFERENCES "languages" ("id")`);
        await queryRunner.query(`ALTER TABLE "password_reset_requests" ADD CONSTRAINT "FK_91edfdb7662932426087df8df4d" FOREIGN KEY ("userId") REFERENCES "users" ("id")`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "roles" ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`);
        await queryRunner.query(`ALTER TABLE "password_reset_requests" DROP CONSTRAINT "FK_91edfdb7662932426087df8df4d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5467acf58b481907933d4eaf046"`);
        await queryRunner.query(`DROP INDEX "IDX_1cf664021f00b9cc1ff95e17de"`);
        await queryRunner.query(`DROP INDEX "IDX_e4435209df12bc1f001e536017"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`DROP TABLE "logs"`);
        await queryRunner.query(`DROP TABLE "password_reset_requests"`);
        await queryRunner.query(`DROP INDEX "IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "IDX_f6d54f95c31b73fb1bdd8e91d0"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "IDX_0e58ae76fbd70ddec9f0713281"`);
        await queryRunner.query(`DROP INDEX "IDX_7397752718d1c9eb873722ec9b"`);
        await queryRunner.query(`DROP TABLE "languages"`);
    }

}
