import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionManagerService {
  getHello(): string {
    return 'Hello World!';
  }
}
