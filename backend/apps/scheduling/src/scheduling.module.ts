import { Module } from '@nestjs/common';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';

@Module({
  imports: [],
  controllers: [SchedulingController],
  providers: [SchedulingService],
})
export class SchedulingModule {}
