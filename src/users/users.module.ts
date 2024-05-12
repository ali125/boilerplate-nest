import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule as UsersAdminModule } from './admin/users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersAdminModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
