import { Injectable, NotFoundException } from '@nestjs/common';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';

@Injectable()
export class CategoriesService extends DataAccess<Category> {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {
    super(categoriesRepository);
  }
  async create(
    userId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category | null> {
    const { title, slug, description, status, parentId } = createCategoryDto;
    const category = new Category();
    category.title = title;
    category.slug = await this.generateSlug({ slug, title });
    category.description = description;
    category.status = status;
    category.userId = userId;
    if (parentId) category.parentId = parentId;

    return await this.categoriesRepository.manager.save(category);
  }

  async findAll(dataAccessListDto: DataAccessListDTO) {
    return this.baseFindAll(dataAccessListDto, {
      relations: ['user', 'parent'],
    });
  }

  async findOne(id: string): Promise<Category | null> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['user', 'parent'],
    });
    if (!category) {
      throw new NotFoundException('Category Not Found!');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    const { title, slug, description, parentId } = updateCategoryDto;

    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category Not Found!');
    }

    if (title) category.title = title;
    if (slug) category.slug = await this.generateSlug({ slug, title, id });
    if (description) category.description = description;
    if (parentId) category.parentId = parentId;

    return await this.categoriesRepository.manager.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category Not Found!');
    }
    await this.categoriesRepository.softRemove(category);
  }
}
