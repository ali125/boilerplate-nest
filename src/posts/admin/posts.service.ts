import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { InjectRepository } from '@nestjs/typeorm';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService extends DataAccess<Post> {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {
    super(postsRepository);
  }

  private async generateSlug(slug?: string, title?: string) {
    // Generate slug based on title
    const baseSlug = slugify(slug || title, { lower: true });

    // Check if slug already exists
    let slugExists = true;
    let counter = 1;
    let newSlug = baseSlug;

    while (slugExists) {
      // Check if slug already exists in the database
      // (You need to implement a function to check if a slug exists in your repository)
      const existingPost = await this.postsRepository.findOneBy({
        slug: newSlug,
      });
      if (!existingPost) {
        // If the slug does not exist, set it to the newSlug
        slugExists = false;
      } else {
        // If the slug exists, generate a new slug by appending a counter
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    return newSlug;
  }

  // @Roles(Role.Admin)
  async create(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<Post | null> {
    const { title, slug, description, status } = createPostDto;
    const post = new Post();
    post.title = title;
    post.slug = await this.generateSlug(slug, title);
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
    if (slug) post.slug = await this.generateSlug(slug);
    if (description) post.description = description;

    return await this.postsRepository.manager.save(post);
  }

  async remove(id: string): Promise<void> {
    const user = await this.postsRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    await this.postsRepository.softRemove(user);
  }
}
