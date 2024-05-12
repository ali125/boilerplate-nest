import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { TagsService } from '@/tags/admin/tags.service';

@Injectable()
export class PostsService extends DataAccess<Post> {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private tagsService: TagsService,
  ) {
    super(postsRepository);
  }

  async create(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<Post | null> {
    const { title, slug, description, status, imageUrl, categoryId, tagIds } =
      createPostDto;
    const post = new Post();
    post.title = title;
    post.slug = await this.generateSlug({ slug, title });
    post.description = description;
    post.status = status;
    post.userId = userId;
    post.imageUrl = imageUrl;

    if (categoryId) post.categoryId = categoryId;

    if (tagIds) {
      const tags = await this.tagsService.findAllByIds(tagIds);
      post.tags = tags;
    }

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
      relations: ['user', 'category', 'tags'],
    });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    const { title, slug, description, imageUrl, categoryId, tagIds } =
      updatePostDto;

    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }

    if (title) post.title = title;
    if (slug) post.slug = await this.generateSlug({ slug, id });
    if (description) post.description = description;
    if (imageUrl) post.imageUrl = imageUrl;

    if (categoryId) post.categoryId = categoryId;

    if (tagIds) {
      const tags = await this.tagsService.findAllByIds(tagIds);
      post.tags = tags;
    }

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
