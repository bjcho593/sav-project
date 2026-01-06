import { Test, TestingModule } from '@nestjs/testing';
import { QrEngineController } from './qr-engine.controller';
import { QrEngineService } from './qr-engine.service';

describe('QrEngineController', () => {
  let qrEngineController: QrEngineController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QrEngineController],
      providers: [QrEngineService],
    }).compile();

    qrEngineController = app.get<QrEngineController>(QrEngineController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(qrEngineController.getHello()).toBe('Hello World!');
    });
  });
});
