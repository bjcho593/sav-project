import { NestFactory } from '@nestjs/core';
import { QrEngineModule } from './qr-engine.module';

async function bootstrap() {
  const app = await NestFactory.create(QrEngineModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
