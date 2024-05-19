import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedForgotTokenUser1716118873113 implements MigrationInterface {
    name = 'AddedForgotTokenUser1716118873113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "forgotToken" character varying(200)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "forgotToken"`);
    }

}
