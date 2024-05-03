import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { DataAccessQueryDTO } from '@/model/data-access/data-access.dto';
import { Public } from '@/decorators/public.decorator';
import { convertDataAccessQueryToDto } from '@/helper/string';

@Public()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get()
  findAll(
    @Query()
    dataAccessListDto: DataAccessQueryDTO,
  ) {
    return this.postsService.findAll(
      convertDataAccessQueryToDto(dataAccessListDto),
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.postsService.findOne(id);
  }
}
