import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { CategoryStatus } from '../interface/category-status.enum';

export class CreateCategoryDto {
  @MaxLength(100)
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsUUID()
  @IsOptional()
  parentId: string;

  @IsEnum(CategoryStatus)
  @IsOptional()
  status: string;
}
