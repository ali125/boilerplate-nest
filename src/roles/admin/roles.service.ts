import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../entities/role.entity';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';
import { PermissionsService } from '@/permissions/admin/permissions.service';

@Injectable()
export class RolesService extends DataAccess<Role> {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private permissionsService: PermissionsService,
  ) {
    super(rolesRepository);
  }
  async create(
    userId: string,
    createRoleDto: CreateRoleDto,
  ): Promise<Role | null> {
    const { title, description, permissions: permissionIds } = createRoleDto;
    const role = new Role();
    role.title = title;
    role.userId = userId;
    if (description) role.description = description;

    const permissions =
      await this.permissionsService.findAllByIds(permissionIds);
    role.permissions = permissions;

    return await this.rolesRepository.manager.save(role);
  }

  async findAll(dataAccessListDto: DataAccessListDTO) {
    return this.baseFindAll(dataAccessListDto, {
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Role | null> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['user', 'permissions'],
    });
    if (!role) {
      throw new NotFoundException('Role Not Found!');
    }
    return role;
  }

  async update(id: string, updateTagDto: UpdateRoleDto): Promise<Role | null> {
    const { title, description, permissions: permissionIds } = updateTagDto;

    const role = await this.rolesRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException('Role Not Found!');
    }

    if (title) role.title = title;
    if (description) role.description = description;

    const permissions =
      await this.permissionsService.findAllByIds(permissionIds);
    role.permissions = permissions;

    return await this.rolesRepository.manager.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.rolesRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException('Role Not Found!');
    }
    await this.rolesRepository.softRemove(role);
  }
}
