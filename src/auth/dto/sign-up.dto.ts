import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SignUpDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  mobile: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
