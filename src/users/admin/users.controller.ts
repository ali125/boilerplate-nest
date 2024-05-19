import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { DataAccessQueryDTO } from '@/model/data-access/data-access.dto';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { convertDataAccessQueryToDto } from '@/helper/string';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  create(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3 * 1024 * 1024,
            message: 'expected size is less than 3 Mb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
        exceptionFactory(err) {
          return new BadRequestException({
            property: 'avatar',
            message: [err],
          });
        },
      }),
    )
    file: Express.Multer.File,
    @Body() createUserDto: CreateUserDTO,
  ) {
    return this.usersService.create({
      ...createUserDto,
      avatar: file?.path,
    });
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Patch(':id')
  update(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({
            maxSize: 3 * 1024 * 1024,
            message: 'expected size is less than 3 Mb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
        exceptionFactory(err) {
          return new BadRequestException({
            property: 'avatar',
            message: [err],
          });
        },
      }),
    )
    file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.usersService.update(id, {
      ...updateUserDto,
      avatar: file?.path,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
