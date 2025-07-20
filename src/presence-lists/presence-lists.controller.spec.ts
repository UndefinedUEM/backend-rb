import { Test, TestingModule } from '@nestjs/testing';
import { PresenceListsController } from './presence-lists.controller';

describe('PresenceListsController', () => {
  let controller: PresenceListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresenceListsController],
    }).compile();

    controller = module.get<PresenceListsController>(PresenceListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
