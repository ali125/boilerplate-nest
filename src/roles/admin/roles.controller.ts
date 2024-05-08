import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { UserId } from '@/decorators/userId.decorator';
import { DataAccessQueryDTO } from '@/model/data-access/data-access.dto';
import { convertDataAccessQueryToDto } from '@/helper/string';

@Controller('admin/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createPermissionDto: CreateRoleDto, @UserId() userId: string) {
    return this.rolesService.create(userId, createPermissionDto);
  }

  @Get('modules')
  findAllModules() {
    return ['Post', 'User', 'Category', 'Tag', 'Permission', 'Role'];
  }

  @Get()
  findAll(
    @Query()
    dataAccessListDto: DataAccessQueryDTO,
  ) {
    return this.rolesService.findAll(
      convertDataAccessQueryToDto(dataAccessListDto),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
