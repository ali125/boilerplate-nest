import { Injectable } from '@nestjs/common';
import { SeedPermissionsService } from './seed-permissions/seed-permissions.service';
import { SeedUsersService } from './seed-users/seed-users.service';

@Injectable()
export class SeedService {
  constructor(
    private seedPermissionsService: SeedPermissionsService,
    private seedUsersService: SeedUsersService,
  ) {}

  async seedData() {
    await this.seedPermissionsService.seedData();
    await this.seedUsersService.seedData();
  }
}
