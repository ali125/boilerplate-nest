import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedPermissionsService } from './seed-permissions/seed-permissions.service';

import { Permission } from '@/permissions/entities/permission.entity';
import { Role } from '@/roles/entities/role.entity';
import { User } from '@/users/entities/user.entity';
import { SeedUsersService } from './seed-users/seed-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, User])],
  providers: [SeedService, SeedPermissionsService, SeedUsersService],
})
export class SeedModule implements OnApplicationBootstrap {
  constructor(private readonly seedService: SeedService) {}

  async onApplicationBootstrap() {
    // await this.seedService.seedData();
  }
}
