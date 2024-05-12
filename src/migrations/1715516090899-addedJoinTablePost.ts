import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedJoinTablePost1715516090899 implements MigrationInterface {
    name = 'AddedJoinTablePost1715516090899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags_posts_posts" ("tagsId" uuid NOT NULL, "postsId" uuid NOT NULL, CONSTRAINT "PK_80913b365feabf5036e3f1dd67b" PRIMARY KEY ("tagsId", "postsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fff7d6237fcff2a66b701d6995" ON "tags_posts_posts" ("tagsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c24352ded9a4768d79a9456ec9" ON "tags_posts_posts" ("postsId") `);
        await queryRunner.query(`CREATE TABLE "posts_tags_tags" ("postsId" uuid NOT NULL, "tagsId" uuid NOT NULL, CONSTRAINT "PK_0102fd077ecbe473388af8f3358" PRIMARY KEY ("postsId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cf364c7e6905b285c4b55a0034" ON "posts_tags_tags" ("postsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce163a967812183a51b044f740" ON "posts_tags_tags" ("tagsId") `);
        await queryRunner.query(`ALTER TABLE "tags_posts_posts" ADD CONSTRAINT "FK_fff7d6237fcff2a66b701d6995e" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tags_posts_posts" ADD CONSTRAINT "FK_c24352ded9a4768d79a9456ec98" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts_tags_tags" ADD CONSTRAINT "FK_cf364c7e6905b285c4b55a00343" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_tags_tags" ADD CONSTRAINT "FK_ce163a967812183a51b044f7404" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts_tags_tags" DROP CONSTRAINT "FK_ce163a967812183a51b044f7404"`);
        await queryRunner.query(`ALTER TABLE "posts_tags_tags" DROP CONSTRAINT "FK_cf364c7e6905b285c4b55a00343"`);
        await queryRunner.query(`ALTER TABLE "tags_posts_posts" DROP CONSTRAINT "FK_c24352ded9a4768d79a9456ec98"`);
        await queryRunner.query(`ALTER TABLE "tags_posts_posts" DROP CONSTRAINT "FK_fff7d6237fcff2a66b701d6995e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce163a967812183a51b044f740"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf364c7e6905b285c4b55a0034"`);
        await queryRunner.query(`DROP TABLE "posts_tags_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c24352ded9a4768d79a9456ec9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fff7d6237fcff2a66b701d6995"`);
        await queryRunner.query(`DROP TABLE "tags_posts_posts"`);
    }

}
