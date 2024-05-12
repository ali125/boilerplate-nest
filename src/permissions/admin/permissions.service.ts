import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { Permission } from '../entities/permission.entity';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';

@Injectable()
export class PermissionsService extends DataAccess<Permission> {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    // private dataSource: DataSource,
  ) {
    super(permissionsRepository);
  }

  // async getAllEntityNames(): Promise<string[]> {
  //   const entitiesMetadata: EntityMetadata[] = this.dataSource.entityMetadatas;
  //   const entityNames: string[] = entitiesMetadata.map((entity) => entity.name);
  //   const excludes = [
  //     'permissions_roles_roles',
  //     'roles_permissions_permissions',
  //     'RefreshToken',
  //     'Permission',
  //   ];
  //   return entityNames.filter((name) => !excludes.includes(name));
  // }

  async findAllQuery(dataAccessListDto: DataAccessListDTO) {
    return this.baseFindAll(dataAccessListDto);
  }

  async findAll() {
    return this.permissionsRepository.find();
  }

  async findAllByIds(ids: string[]): Promise<Permission[]> {
    if (ids.length === 0) return [];
    return this.permissionsRepository.find({ where: { id: In(ids) } });
  }

  async findOne(id: string): Promise<Permission | null> {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!permission) {
      throw new NotFoundException('Permission Not Found!');
    }
    return permission;
  }
}
