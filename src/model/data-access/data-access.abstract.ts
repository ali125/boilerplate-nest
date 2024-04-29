import { FindManyOptions, Repository } from 'typeorm';
import { DataAccessList } from './data-access.interface';
import { DataAccessListDTO } from './data-access.dto';

export abstract class DataAccess<T> {
  constructor(private repository: Repository<T>) {}

  async baseFindAll(
    dataAccessListDto: DataAccessListDTO,
    options?: FindManyOptions<T>,
  ): Promise<DataAccessList<T>> {
    const { page, limit } = dataAccessListDto;

    const offset = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      skip: offset,
      take: limit,
      ...options,
    });

    return {
      perPage: limit,
      currentPage: page,
      total,
      data,
    };
  }
}
