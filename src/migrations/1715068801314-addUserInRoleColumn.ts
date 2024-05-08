import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserInRoleColumn1715068801314 implements MigrationInterface {
    name = 'AddUserInRoleColumn1715068801314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_c8db5603420d119933bbc5c398c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_c8db5603420d119933bbc5c398c"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "userId"`);
    }

}
