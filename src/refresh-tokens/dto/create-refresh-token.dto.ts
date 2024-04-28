import { IsString } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsString()
  token: string;

  @IsString()
  ip: string;

  @IsString()
  userAgent: string;

  @IsString()
  userId: string;
}
