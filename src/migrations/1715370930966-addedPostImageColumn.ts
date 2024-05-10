import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPostImageColumn1715370930966 implements MigrationInterface {
    name = 'AddedPostImageColumn1715370930966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "imageUrl" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "imageUrl"`);
    }

}
