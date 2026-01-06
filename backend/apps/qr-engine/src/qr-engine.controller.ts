import { Controller, Get } from '@nestjs/common';
import { QrEngineService } from './qr-engine.service';

@Controller()
export class QrEngineController {
  constructor(private readonly qrEngineService: QrEngineService) {}

  @Get()
  getHello(): string {
    return this.qrEngineService.getHello();
  }
}
