import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePermissionActionColumnName1715007023477 implements MigrationInterface {
    name = 'ChangePermissionActionColumnName1715007023477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" RENAME COLUMN "status" TO "action"`);
        await queryRunner.query(`ALTER TYPE "public"."permissions_status_enum" RENAME TO "permissions_action_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."permissions_action_enum" RENAME TO "permissions_status_enum"`);
        await queryRunner.query(`ALTER TABLE "permissions" RENAME COLUMN "action" TO "status"`);
    }

}
