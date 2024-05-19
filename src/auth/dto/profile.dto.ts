import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ProfileDTO {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  mobile: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  about: string;

  avatar?: string | null;
}
