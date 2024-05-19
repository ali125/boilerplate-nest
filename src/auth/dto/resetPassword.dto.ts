import { IsString } from 'class-validator';

export class ResetPassowrdDTO {
  @IsString()
  newPassword: string;

  @IsString()
  token: string;
}
