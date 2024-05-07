import { IsEnum, IsString } from 'class-validator';
import { CaslAction } from '@/casl/casl.enum';

export class CreatePermissionDto {
  @IsString()
  module: string;

  @IsEnum(CaslAction)
  action: string;
}
