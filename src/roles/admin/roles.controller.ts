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
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { UserId } from '@/decorators/userId.decorator';
import { DataAccessQueryDTO } from '@/model/data-access/data-access.dto';
import { convertDataAccessQueryToDto } from '@/helper/string';
import { PoliciesGuard } from '@/casl/policy.guard';
import { CheckPolicies } from '@/casl/policy.decorator';
import { RolePolicyHandler } from '@/casl/policy.interface';
import { CaslAction } from '@/casl/casl.enum';

@UseGuards(PoliciesGuard)
@Controller('admin/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @CheckPolicies(new RolePolicyHandler(CaslAction.Create))
  @Post()
  create(@Body() createPermissionDto: CreateRoleDto, @UserId() userId: string) {
    return this.rolesService.create(userId, createPermissionDto);
  }

  @CheckPolicies(new RolePolicyHandler(CaslAction.Read))
  @Get('modules')
  findAllModules() {
    return ['Post', 'User', 'Category', 'Tag', 'Permission', 'Role'];
  }

  @CheckPolicies(new RolePolicyHandler(CaslAction.Read))
  @Get()
  findAll(
    @Query()
    dataAccessListDto: DataAccessQueryDTO,
  ) {
    return this.rolesService.findAll(
      convertDataAccessQueryToDto(dataAccessListDto),
    );
  }

  @CheckPolicies(new RolePolicyHandler(CaslAction.Read))
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @CheckPolicies(new RolePolicyHandler(CaslAction.Update))
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updatePermissionDto);
  }

  @CheckPolicies(new RolePolicyHandler(CaslAction.Delete))
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
