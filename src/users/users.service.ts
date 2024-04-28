import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from './interfaces/user-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDTO): Promise<User | null> {
    const user = new User();
    const { firstName, lastName, password, email, mobile } = createUserDto;
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = await bcrypt.hash(password, 10);
    user.email = email;
    if (mobile) user.mobile = mobile;

    // check for duplicate email in the db
    const duplicate = await this.usersRepository.findOneBy({ email });
    if (duplicate) {
      // 409 Conflict
      throw new ConflictException('This Email is already exists.');
    }

    return await this.usersRepository.manager.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    return user;
  }

  async findOneAuth(
    email: string,
  ): Promise<{ id: string; email: string; password: string } | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    return user;
  }

  async block(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    user.status = UserStatus.BLOCKED;
    user.blockedAt = new Date();

    return await this.usersRepository.manager.save(user);
  }

  async unBlock(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    user.status = UserStatus.ACTIVE;
    user.blockedAt = null;

    return await this.usersRepository.manager.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDTO) {
    const { firstName, lastName, email, mobile } = updateUserDto;

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email && user.email !== email) {
      // check for duplicate email in the db
      const duplicate = await this.usersRepository.findOneBy({ email });
      if (duplicate) {
        // 409 Conflict
        throw new ConflictException('This Email is already exists.');
      }
      user.email = email;
    }
    if (mobile) user.mobile = mobile;

    return await this.usersRepository.manager.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    user.email = `${new Date().toISOString()}-${user.email}`;
    await this.usersRepository.manager.save(user);
    await this.usersRepository.softRemove(user);
  }
}
