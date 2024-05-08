import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDescriptionsOptional1715068605246 implements MigrationInterface {
    name = 'MakeDescriptionsOptional1715068605246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tags" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "description" SET NOT NULL`);
    }

}
