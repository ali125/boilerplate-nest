import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedResetTokenUser1716120330543 implements MigrationInterface {
    name = 'AddedResetTokenUser1716120330543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "forgotToken"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "resetToken" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "resetTokenExpires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetTokenExpires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetToken"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "forgotToken" character varying(200)`);
    }

}
