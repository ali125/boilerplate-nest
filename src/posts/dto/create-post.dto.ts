import { IsString, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { PostStatus } from '../interface/post-status.enum';

export class CreatePostDto {
  @MaxLength(100)
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsEnum(PostStatus)
  @IsOptional()
  status: string;

  imageUrl?: string | null;
}
