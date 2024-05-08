import { Test, TestingModule } from '@nestjs/testing';
import { SeedUsersService } from './seed-users.service';

describe('SeedUsersService', () => {
  let service: SeedUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedUsersService],
    }).compile();

    service = module.get<SeedUsersService>(SeedUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
