import { IsString } from 'class-validator';

export class ChangePassowrdDTO {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}
