import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokensModule } from '@/refresh-tokens/refresh-tokens.module';
import { UsersModule } from '@/users/users.module';
import { RolesModule } from '@/roles/roles.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    RefreshTokensModule,
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      // signOptions: { expiresIn: '60s' },
      signOptions: { expiresIn: '1hr' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
