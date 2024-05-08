import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @MaxLength(100)
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  permissions: string[];
}
