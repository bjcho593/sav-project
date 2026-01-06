import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulingService {
  getHello(): string {
    return 'Hello World!';
  }
}
