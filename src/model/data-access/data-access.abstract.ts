import {
  And,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { DataAccessList } from './data-access.interface';
import { DataAccessListDTO } from './data-access.dto';
import { filterControlOperator } from '@/helper/filter';
import { isUUID } from 'class-validator';

export abstract class DataAccess<T> {
  constructor(private repository: Repository<T>) {}

  async baseFindAll(
    dataAccessListDto: DataAccessListDTO,
    options?: FindManyOptions<T>,
  ): Promise<DataAccessList<T>> {
    const { page, perPage, sortBy, sortOrder, filterOperator, filters } =
      dataAccessListDto;

    const offset = (page - 1) * perPage;

    let order: FindOptionsOrder<T>;
    if (sortBy && sortOrder) {
      order = {
        [sortBy as string]: sortOrder === 'desc' ? 'DESC' : 'ASC',
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

    return {
      perPage: perPage,
      currentPage: page,
      total,
      data,
    };
  }
}
