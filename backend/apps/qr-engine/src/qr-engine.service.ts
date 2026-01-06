import { Injectable } from '@nestjs/common';

@Injectable()
export class QrEngineService {
  getHello(): string {
    return 'Hello World!';
  }
}
