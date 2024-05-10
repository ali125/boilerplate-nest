import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { UsersService } from '@/users/users.service';

@Injectable()
export class PostsService extends DataAccess<Post> {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {
    super(postsRepository);
  }

  // @Roles(Role.Admin)
  async create(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<Post | null> {
    // const user = await this.usersService.findOne(userId);
    // const ability = this.caslAbilityFactory.createForUser(user);

    // if (!ability.can(CaslAction.Create, 'all')) {
    //   throw new ForbiddenException();
    // }

    const { title, slug, description, status } = createPostDto;
    const post = new Post();
    post.title = title;
    post.slug = await this.generateSlug({ slug, title });
    post.description = description;
    post.status = status;
    post.userId = userId;

    return await this.postsRepository.manager.save(post);
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

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    const { title, slug, description } = updatePostDto;

    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }

    if (title) post.title = title;
    if (slug) post.slug = await this.generateSlug({ slug, id });
    if (description) post.description = description;

    return await this.postsRepository.manager.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    await this.postsRepository.softRemove(post);
  }
}
