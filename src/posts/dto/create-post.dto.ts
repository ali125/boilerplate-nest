import {
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  IsBooleanString,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @MaxLength(50)
  @MinLength(5)
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  slug: string;

  // @IsEnum(PostStatus)
  // @IsOptional()
  // status: string;
  @IsBooleanString()
  @IsOptional()
  isPublish: boolean = false;

  @IsString()
  @IsOptional()
  categoryId: string;

  @IsArray()
  @IsOptional()
  tagIds: string[];

  image?: string | null;
}
