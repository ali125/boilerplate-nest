import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TagStatus } from '../interface/tag-status.enum';

export class CreateTagDto {
  @MaxLength(100)
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsEnum(TagStatus)
  @IsOptional()
  status: string;
}
