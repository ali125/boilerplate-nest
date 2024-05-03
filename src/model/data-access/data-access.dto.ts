import { IsOptional, Min, IsNumber, IsString, IsIn } from 'class-validator';

type SORT_TYPES = 'asc' | 'desc';
type FILTER_OPERATORS = 'and' | 'or';

export class DataAccessListDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  perPage: number = 10;

  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: SORT_TYPES;

  @IsOptional()
  @IsIn(['and', 'or'])
  filterOperator: FILTER_OPERATORS;

  @IsOptional()
  @IsString()
  filters: string;
}

export class DataAccessQueryDTO {
  @IsOptional()
  @IsString()
  page: string = '1';

  @IsString()
  perPage: string = '10';

  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: SORT_TYPES;

  @IsOptional()
  @IsIn(['and', 'or'])
  filterOperator: FILTER_OPERATORS;

  @IsOptional()
  @IsString()
  filters: string;
}
