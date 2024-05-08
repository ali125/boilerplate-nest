import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSuperAdminColumn1715149237309 implements MigrationInterface {
    name = 'AddedSuperAdminColumn1715149237309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD "superAdmin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "superAdmin"`);
    }

}
