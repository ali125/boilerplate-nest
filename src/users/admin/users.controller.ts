import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { DataAccessQueryDTO } from '@/model/data-access/data-access.dto';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { convertDataAccessQueryToDto } from '@/helper/string';

@Controller('admin/users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true }))
    dataAccessListDto: DataAccessQueryDTO,
  ) {
    return this.usersService.findAll(
      convertDataAccessQueryToDto(dataAccessListDto),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
