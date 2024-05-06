import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Tag } from '../entities/tag.entity';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';
import { Repository } from 'typeorm';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService extends DataAccess<Tag> {
  constructor(
    @InjectRepository(Tag)
    private categoriesRepository: Repository<Tag>,
  ) {
    super(categoriesRepository);
  }
  async create(
    userId: string,
    createTagDto: CreateTagDto,
  ): Promise<Tag | null> {
    const { title, slug, description, status } = createTagDto;
    const tag = new Tag();
    tag.title = title;
    tag.slug = await this.generateSlug(slug, title);
    tag.description = description;
    tag.status = status;
    tag.userId = userId;

    return await this.categoriesRepository.manager.save(tag);
  }

  async findAll(dataAccessListDto: DataAccessListDTO) {
    return this.baseFindAll(dataAccessListDto, {
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Tag | null> {
    const tag = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!tag) {
      throw new NotFoundException('Tag Not Found!');
    }
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag | null> {
    const { title, slug, description } = updateTagDto;

    const tag = await this.categoriesRepository.findOneBy({ id });
    if (!tag) {
      throw new NotFoundException('Tag Not Found!');
    }

    if (title) tag.title = title;
    if (slug) tag.slug = await this.generateSlug(slug);
    if (description) tag.description = description;

    return await this.categoriesRepository.manager.save(tag);
  }

  async remove(id: string): Promise<void> {
    const Tag = await this.categoriesRepository.findOneBy({ id });
    if (!Tag) {
      throw new NotFoundException('Tag Not Found!');
    }
    await this.categoriesRepository.softRemove(Tag);
  }
}