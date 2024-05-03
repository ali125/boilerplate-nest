import {
  DataAccessListDTO,
  DataAccessQueryDTO,
} from '@/model/data-access/data-access.dto';

export const convertDataAccessQueryToDto = (
  dataAccessQueryDto: DataAccessQueryDTO,
): DataAccessListDTO => {
  const { page, perPage, ...rest } = dataAccessQueryDto;
  return {
    ...rest,
    page: +(page || 1),
    perPage: +(perPage || 10),
  };
};
