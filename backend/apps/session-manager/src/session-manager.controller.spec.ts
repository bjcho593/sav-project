import { Test, TestingModule } from '@nestjs/testing';
import { SessionManagerController } from './session-manager.controller';
import { SessionManagerService } from './session-manager.service';

describe('SessionManagerController', () => {
  let sessionManagerController: SessionManagerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SessionManagerController],
      providers: [SessionManagerService],
    }).compile();

    sessionManagerController = app.get<SessionManagerController>(SessionManagerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sessionManagerController.getHello()).toBe('Hello World!');
    });
  });
});
