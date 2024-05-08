import { Test, TestingModule } from '@nestjs/testing';
import { SeedPermissionsService } from './seed-permissions.service';

describe('SeedPermissionsService', () => {
  let service: SeedPermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedPermissionsService],
    }).compile();

    service = module.get<SeedPermissionsService>(SeedPermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
