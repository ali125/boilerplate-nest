import { Injectable } from '@nestjs/common';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
// import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { UsersService } from '@/users/users.service';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private usersService: UsersService,
  ) {}

  async create(createRefreshTokenDto: CreateRefreshTokenDto) {
    const { ip, token, userAgent, userId } = createRefreshTokenDto;
    const refreshToken = new RefreshToken();
    refreshToken.ip = ip;
    refreshToken.token = token;
    refreshToken.userAgent = userAgent;
    refreshToken.user = await this.usersService.findOne(userId);

    return this.refreshTokensRepository.manager.save(refreshToken);
  }

  findAll() {
    return `This action returns all refreshTokens`;
  }

  findOne(token: string) {
    return this.refreshTokensRepository.findOneBy({ token });
  }

  // update(id: string, updateRefreshTokenDto: UpdateRefreshTokenDto) {
  //   return `This action updates a #${id} refreshToken`;
  // }

  removeByUserId(userId: string) {
    return this.refreshTokensRepository.softRemove({ userId });
  }

  removeByToken(token: string) {
    return this.refreshTokensRepository.softRemove({ token });
  }
}
