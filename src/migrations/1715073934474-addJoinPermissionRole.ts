import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJoinPermissionRole1715073934474 implements MigrationInterface {
    name = 'AddJoinPermissionRole1715073934474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions_roles_roles" ("permissionsId" uuid NOT NULL, "rolesId" uuid NOT NULL, CONSTRAINT "PK_4a0eb2f30d7d81ba1069abaa94d" PRIMARY KEY ("permissionsId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aff2f66944175a2cb34cfa8a50" ON "permissions_roles_roles" ("permissionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b746e554e30a7c6027aab29cda" ON "permissions_roles_roles" ("rolesId") `);
        await queryRunner.query(`CREATE TABLE "roles_permissions_permissions" ("rolesId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842" PRIMARY KEY ("rolesId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dc2b9d46195bb3ed28abbf7c9e" ON "roles_permissions_permissions" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd4d5d4c7f7ff16c57549b72c6" ON "roles_permissions_permissions" ("permissionsId") `);
        await queryRunner.query(`ALTER TABLE "permissions_roles_roles" ADD CONSTRAINT "FK_aff2f66944175a2cb34cfa8a503" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permissions_roles_roles" ADD CONSTRAINT "FK_b746e554e30a7c6027aab29cda6" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3"`);
        await queryRunner.query(`ALTER TABLE "permissions_roles_roles" DROP CONSTRAINT "FK_b746e554e30a7c6027aab29cda6"`);
        await queryRunner.query(`ALTER TABLE "permissions_roles_roles" DROP CONSTRAINT "FK_aff2f66944175a2cb34cfa8a503"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd4d5d4c7f7ff16c57549b72c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dc2b9d46195bb3ed28abbf7c9e"`);
        await queryRunner.query(`DROP TABLE "roles_permissions_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b746e554e30a7c6027aab29cda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aff2f66944175a2cb34cfa8a50"`);
        await queryRunner.query(`DROP TABLE "permissions_roles_roles"`);
    }

}
