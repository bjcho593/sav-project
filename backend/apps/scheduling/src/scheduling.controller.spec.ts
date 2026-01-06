import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';

describe('SchedulingController', () => {
  let schedulingController: SchedulingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SchedulingController],
      providers: [SchedulingService],
    }).compile();

    schedulingController = app.get<SchedulingController>(SchedulingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(schedulingController.getHello()).toBe('Hello World!');
    });
  });
});
