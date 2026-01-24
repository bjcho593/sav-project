import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';

@Module({
  controllers: [EnrollmentController],
})
export class EnrollmentModule {}
