import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentController', () => {
  let enrollmentController: EnrollmentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [EnrollmentService],
    }).compile();

    enrollmentController = app.get<EnrollmentController>(EnrollmentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(enrollmentController.getHello()).toBe('Hello World!');
    });
  });
});
