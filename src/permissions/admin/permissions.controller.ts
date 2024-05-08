import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { DataAccessQueryDTO } from '@/model/data-access/data-access.dto';
import { convertDataAccessQueryToDto } from '@/helper/string';
import { PermissionsService } from './permissions.service';

@Controller('admin/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

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
}
