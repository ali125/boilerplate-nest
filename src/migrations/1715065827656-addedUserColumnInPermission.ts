import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUserColumnInPermission1715065827656 implements MigrationInterface {
    name = 'AddedUserColumnInPermission1715065827656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_eab26c6cc4b9cc604099bc32dff" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_eab26c6cc4b9cc604099bc32dff"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "userId"`);
    }

}
