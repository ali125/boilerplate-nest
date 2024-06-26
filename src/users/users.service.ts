import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from './interfaces/user-status.enum';
import { DataAccess } from '@/model/data-access/data-access.abstract';
import { DataAccessListDTO } from '@/model/data-access/data-access.dto';
import { ChangePassowrdDTO } from '@/auth/dto/changePassword.dto';
import { addHours } from 'date-fns';

@Injectable()
export class UsersService extends DataAccess<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async create(createUserDto: CreateUserDTO): Promise<User | null> {
    const user = new User();
    const { firstName, lastName, password, email, mobile, avatar, about } =
      createUserDto;

    // check for duplicate email in the db
    const duplicate = await this.usersRepository.findOneBy({ email });
    if (duplicate) {
      // 409 Conflict
      throw new ConflictException('This Email is already exists.');
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.password = await bcrypt.hash(password, 10);
    user.email = email;
    user.about = about;
    if (mobile) user.mobile = mobile;
    if (avatar) user.avatarUrl = avatar;

    return await this.usersRepository.manager.save(user);
  }

  async findAll(dataAccessListDto: DataAccessListDTO) {
    return this.baseFindAll(dataAccessListDto);
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
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
      // throw new NotFoundException('User Not Found!');
      throw new BadRequestException();
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
    const { firstName, lastName, email, mobile, avatar, about } = updateUserDto;

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    if (email && user.email !== email) {
      // check for duplicate email in the db
      const duplicate = await this.usersRepository.findOneBy({ email });
      if (duplicate) {
        // 409 Conflict
        throw new ConflictException('This Email is already exists.');
      }
      user.email = email;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (avatar) user.avatarUrl = avatar;
    if (about) user.about = about;
    if (mobile) user.mobile = mobile;

    return await this.usersRepository.manager.save(user);
  }

  async updateForgotToken(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    const expires = addHours(new Date(), 1); // token valid for 1 hour
    const resetToken = crypto.randomBytes(32).toString('hex');

    console.log({ resetToken });

    user.resetToken = resetToken;
    user.resetTokenExpires = expires;

    return await this.usersRepository.manager.save(user);
  }

  async resetPassowrd(resetToken: string, newPassword: string) {
    const user = await this.usersRepository.findOneBy({
      resetToken,
      resetTokenExpires: MoreThan(new Date()),
    });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;

    await this.usersRepository.manager.save(user);

    return { message: 'password changed successfully' };
  }

  async updatePassowrd(id: string, changePasswordDto: ChangePassowrdDTO) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    // evaluate password
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      throw new BadRequestException({
        property: 'currentPassword',
        message: ["current password doesn't match"],
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await this.usersRepository.manager.save(user);

    return { message: 'password changed successfully' };
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
