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
import { DataAccessQueryDTO } from '@/model/data-access/data-access.dto';
import { convertDataAccessQueryToDto } from '@/helper/string';
import { UserId } from '@/decorators/userId.decorator';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Controller('admin/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @UserId() userId: string,
  ) {
    return this.permissionsService.create(userId, createPermissionDto);
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
    return this.permissionsService.findAll(
      convertDataAccessQueryToDto(dataAccessListDto),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionsService.remove(id);
  }
}
