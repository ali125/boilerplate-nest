import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { Tag } from '../entities/tag.entity';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';
import { In, Repository } from 'typeorm';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService extends DataAccess<Tag> {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {
    super(tagsRepository);
  }
  async create(
    userId: string,
    createTagDto: CreateTagDto,
  ): Promise<Tag | null> {
    const { title, slug, description, status } = createTagDto;
    const tag = new Tag();
    tag.title = title;
    tag.slug = await this.generateSlug({ slug, title });
    tag.description = description;
    tag.status = status;
    tag.userId = userId;

    return await this.tagsRepository.manager.save(tag);
  }

  async findAll(dataAccessListDto: DataAccessListDTO) {
    return this.baseFindAll(dataAccessListDto, {
      relations: ['user'],
    });
  }

  async findAllByIds(ids: string[]): Promise<Tag[]> {
    return this.tagsRepository.find({ where: { id: In(ids) } });
  }

  async findOne(id: string): Promise<Tag | null> {
    const tag = await this.tagsRepository.findOne({
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

    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) {
      throw new NotFoundException('Tag Not Found!');
    }

    if (title) tag.title = title;
    if (slug) tag.slug = await this.generateSlug({ slug, id });
    if (description) tag.description = description;

    return await this.tagsRepository.manager.save(tag);
  }

  async remove(id: string): Promise<void> {
    const tag = await this.tagsRepository.findOneBy({ id });
    if (!tag) {
      throw new NotFoundException('Tag Not Found!');
    }
    await this.tagsRepository.softRemove(tag);
  }
}
