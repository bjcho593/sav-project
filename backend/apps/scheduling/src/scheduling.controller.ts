import { Controller, Get } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';

@Controller()
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Get()
  getHello(): string {
    return this.schedulingService.getHello();
  }
}
