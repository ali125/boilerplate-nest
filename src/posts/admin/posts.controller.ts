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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { DataAccessQueryDTO } from '@/model/data-access/data-access.dto';
import { UserId } from '@/decorators/userId.decorator';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { convertDataAccessQueryToDto } from '@/helper/string';
import { PoliciesGuard } from '@/casl/policy.guard';
import { CheckPolicies } from '@/casl/policy.decorator';
import { PostPolicyHandler } from '@/casl/policy.interface';
import { CaslAction } from '@/casl/casl.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(PoliciesGuard)
@Controller('admin/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @CheckPolicies(new PostPolicyHandler(CaslAction.Create))
  @UseInterceptors(FileInterceptor('image'))
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
            property: 'image',
            message: [err],
          });
        },
      }),
    )
    file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @UserId() userId: string,
  ) {
    return this.postsService.create(userId, {
      ...createPostDto,
      imageUrl: file?.path,
    });
  }

  @CheckPolicies(new PostPolicyHandler(CaslAction.Read))
  @Get()
  findAll(
    @Query()
    dataAccessListDto: DataAccessQueryDTO,
  ) {
    return this.postsService.findAll(
      convertDataAccessQueryToDto(dataAccessListDto),
    );
  }

  @CheckPolicies(new PostPolicyHandler(CaslAction.Read))
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.postsService.findOne(id);
  }

  @UseInterceptors(FileInterceptor('image'))
  @CheckPolicies(new PostPolicyHandler(CaslAction.Update))
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
      }),
    )
    file: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, {
      ...updatePostDto,
      imageUrl: file?.path,
    });
  }

  @CheckPolicies(new PostPolicyHandler(CaslAction.Delete))
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.remove(id);
  }
}
