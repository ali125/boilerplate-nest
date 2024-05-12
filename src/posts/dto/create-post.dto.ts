import {
  IsString,
  MaxLength,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { PostStatus } from '../interface/post-status.enum';

export class CreatePostDto {
  @MaxLength(100)
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsEnum(PostStatus)
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  categoryId: string;

  @IsArray()
  @IsOptional()
  tagIds: string[];

  imageUrl?: string | null;
}
