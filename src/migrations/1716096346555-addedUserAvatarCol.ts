import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserAvatarCol1716096346555 implements MigrationInterface {
    name = 'AddedUserAvatarCol1716096346555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatarUrl" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "about" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "about"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatarUrl"`);
    }

}
