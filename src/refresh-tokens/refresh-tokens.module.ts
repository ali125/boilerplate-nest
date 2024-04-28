import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([RefreshToken])],
  exports: [RefreshTokensService],
  providers: [RefreshTokensService],
})
export class RefreshTokensModule {}
