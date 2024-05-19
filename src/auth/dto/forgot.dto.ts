import { IsEmail } from 'class-validator';

export class ForgotDTO {
  @IsEmail()
  email: string;
}
