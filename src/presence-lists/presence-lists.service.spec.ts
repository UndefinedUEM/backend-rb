import { Test, TestingModule } from '@nestjs/testing';
import { PresenceListsService } from './presence-lists.service';

describe('PresenceListsService', () => {
  let service: PresenceListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresenceListsService],
    }).compile();

    service = module.get<PresenceListsService>(PresenceListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
