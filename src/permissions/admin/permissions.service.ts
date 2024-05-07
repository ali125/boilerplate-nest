import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { Permission } from '../entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';

@Injectable()
export class PermissionsService extends DataAccess<Permission> {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {
    super(permissionsRepository);
  }
  async create(
    userId: string,
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission | null> {
    const { module, action } = createPermissionDto;
    const permission = new Permission();
    permission.module = module;
    permission.action = action;
    permission.userId = userId;

    return await this.permissionsRepository.manager.save(permission);
  }

  async findAll(dataAccessListDto: DataAccessListDTO) {
    return this.baseFindAll(dataAccessListDto);
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

  async update(
    id: string,
    updateTagDto: UpdatePermissionDto,
  ): Promise<Permission | null> {
    const { module, action } = updateTagDto;

    const permission = await this.permissionsRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException('Permission Not Found!');
    }

    if (module) permission.module = module;
    if (action) permission.action = action;

    return await this.permissionsRepository.manager.save(permission);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.permissionsRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException('Permission Not Found!');
    }
    await this.permissionsRepository.softRemove(permission);
  }
}
