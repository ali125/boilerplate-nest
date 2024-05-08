import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCascadePermissionRole1715148472854 implements MigrationInterface {
    name = 'RemoveCascadePermissionRole1715148472854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions_roles_roles" DROP CONSTRAINT "FK_b746e554e30a7c6027aab29cda6"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f"`);
        await queryRunner.query(`ALTER TABLE "permissions_roles_roles" ADD CONSTRAINT "FK_b746e554e30a7c6027aab29cda6" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f"`);
        await queryRunner.query(`ALTER TABLE "permissions_roles_roles" DROP CONSTRAINT "FK_b746e554e30a7c6027aab29cda6"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions_roles_roles" ADD CONSTRAINT "FK_b746e554e30a7c6027aab29cda6" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
