import {
  And,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { isUUID } from 'class-validator';
import slugify from 'slugify';
import { DataAccessList } from './data-access.interface';
import { DataAccessListDTO } from './data-access.dto';
import { filterControlOperator } from '@/helper/filter';

export abstract class DataAccess<T> {
  constructor(private repository: Repository<T>) {}

  async baseFindAll(
    dataAccessListDto: DataAccessListDTO,
    options?: FindManyOptions<T>,
  ): Promise<DataAccessList<T>> {
    const { page, perPage, sortBy, sortOrder, filterOperator, filters } =
      dataAccessListDto;

    const offset = (page - 1) * perPage;

    let order: FindOptionsOrder<T> = {
      createdAt: 'DESC',
    } as any;
    if (sortBy && sortOrder) {
      order = {
        [sortBy as string]: sortOrder === 'asc' ? 'ASC' : 'DESC',
      } as any;
    }

    // include | startWith | endWith | notEqual | equal
    const filterList = (filters || '').split(',');
    let where: FindOptionsWhere<T> | FindOptionsWhere<T>[];

    if (filterList.length > 0) {
      if (filterOperator === 'and') {
        const filterObj = filterList.reduce(
          (acc: { [key: string]: any }, filter: string) => {
            const updateAcc = { ...acc };
            const [key, op, val] = filter.split('|');
            updateAcc[key] = [`${op}|${val}`, ...(updateAcc[key] || [])];
            return updateAcc;
          },
          {},
        );
        where = Object.entries(filterObj).reduce((acc, [key, filterArr]) => {
          const filter = filterArr.map((f: string) => {
            const [op, val] = f.split('|');
            return filterControlOperator(op, val);
          });

          if (key === 'id') {
            const [, val] = filterArr[filterArr.length - 1].split('|');
            return isUUID(val) ? { [key]: val } : null;
          }
          return {
            ...acc,
            [key]: And(...filter),
          };
        }, {});
      } else if (filterOperator === 'or') {
        where = filterList
          .map((filter: string) => {
            const [key, op, val] = filter.split('|');
            if (key === 'id') {
              return isUUID(val) ? { [key as any]: val } : {};
            }
            return {
              [key as any]: filterControlOperator(op, val),
            };
          })
          .filter((i) => i);
      }
    }

    const [data, total] = await this.repository.findAndCount({
      skip: offset,
      take: perPage,
      order,
      where,
      ...options,
    });

    const lastPage = Math.ceil(total / perPage);

    return {
      perPage: perPage,
      currentPage: page,
      lastPage,
      total,
      data,
    };
  }

  protected async generateSlug(slug?: string, title?: string) {
    // Generate slug based on title
    const baseSlug = slugify(slug || title, { lower: true });

    // Check if slug already exists
    let slugExists = true;
    let counter = 1;
    let newSlug = baseSlug;

    while (slugExists) {
      // Check if slug already exists in the database
      // (You need to implement a function to check if a slug exists in your repository)
      const existingPost = await this.repository.findOneBy({
        slug: newSlug,
      } as FindOptionsWhere<any>);
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
}
