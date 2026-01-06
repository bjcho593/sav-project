import { Module } from '@nestjs/common';
import { QrEngineController } from './qr-engine.controller';
import { QrEngineService } from './qr-engine.service';

@Module({
  imports: [],
  controllers: [QrEngineController],
  providers: [QrEngineService],
})
export class QrEngineModule {}
