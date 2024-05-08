import { DataSource, EntityMetadata, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '@/permissions/entities/permission.entity';
import { CaslAction } from '@/casl/casl.enum';

@Injectable()
export class SeedPermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private dataSource: DataSource,
  ) {}

  private async getAllEntityNames(): Promise<string[]> {
    const entitiesMetadata: EntityMetadata[] = this.dataSource.entityMetadatas;
    const entityNames: string[] = entitiesMetadata.map((entity) => entity.name);
    const excludes = [
      'permissions_roles_roles',
      'roles_permissions_permissions',
      'RefreshToken',
      'Permission',
    ];
    return entityNames.filter((name) => !excludes.includes(name));
  }

  async seedData() {
    const moduleNames = await this.getAllEntityNames();

    const existedPermissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .select(['permission.id', 'permission.module'])
      .where('module IN (:...moduleNames)', { moduleNames })
      .getMany();

    const notExistedPermissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .select(['permission.id', 'permission.module'])
      .where('module NOT IN (:...moduleNames)', { moduleNames })
      .getMany();

    const notExistedModules = existedPermissions
      .filter((i) => !moduleNames.includes(i.module))
      .map((i) => i.module);

    if (notExistedPermissions.length > 0) {
      const ids = notExistedPermissions.map((p) => p.id);
      const queryDeleteBuilder = this.permissionRepository.createQueryBuilder();
      await queryDeleteBuilder
        .delete()
        .from(Permission)
        .where('id IN (:...ids)', { ids })
        .execute();
    }

    if (
      notExistedModules.length > 0 ||
      (existedPermissions.length === 0 && notExistedPermissions.length === 0)
    ) {
      const modules =
        notExistedModules.length > 0 ? notExistedModules : moduleNames;
      const permissionData = modules.reduce((acc, module) => {
        const updateAcc = [...acc];
        Object.values(CaslAction).forEach((action) => {
          updateAcc.push({
            module,
            action,
          });
        });
        return updateAcc;
      }, []);
      const queryInsertBuilder = this.permissionRepository.createQueryBuilder();
      await queryInsertBuilder
        .insert()
        .into(Permission)
        .values(permissionData)
        .execute();
    }
  }
}
