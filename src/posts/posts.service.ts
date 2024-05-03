import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';

@Injectable()
export class PostsService extends DataAccess<Post> {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {
    super(postsRepository);
  }

  async findAll(dataAccessListDto: DataAccessListDTO) {
    return this.baseFindAll(dataAccessListDto, {
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Post | null> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    return post;
  }
}
