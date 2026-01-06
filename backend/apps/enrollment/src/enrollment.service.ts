import { Injectable } from '@nestjs/common';

@Injectable()
export class EnrollmentService {
  getHello(): string {
    return 'Hello World!';
  }
}
