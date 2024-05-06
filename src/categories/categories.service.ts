import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService extends DataAccess<Category> {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {
    super(categoriesRepository);
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
}
