import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/users/entities/user.entity';
import { Role } from '@/roles/entities/role.entity';

@Injectable()
export class SeedUsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  private async getAndSeedRole(userId: string) {
    let role = await this.rolesRepository.findOne({
      where: { superAdmin: true },
    });

    if (!role) {
      const newRole = new Role();
      newRole.title = 'SuperAdmin';
      newRole.superAdmin = true;
      newRole.userId = userId;

      role = await this.rolesRepository.manager.save(newRole);
    }

    return role;
  }

  async seedData() {
    const newUser = new User();
    newUser.firstName = 'Admin';
    newUser.lastName = 'Admin';
    newUser.email = 'admin@admin.com';
    newUser.password = await bcrypt.hash('password', 10);

    const user = await this.usersRepository.findOneBy({
      email: newUser.email,
    });

    if (!user) {
      await this.usersRepository.manager.save(newUser);
    }

    const role = await this.getAndSeedRole(user.id);
    user.roleId = role.id;
    await this.usersRepository.manager.save(user);
  }
}
