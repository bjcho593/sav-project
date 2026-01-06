import { NestFactory } from '@nestjs/core';
import { SessionManagerModule } from './session-manager.module';

async function bootstrap() {
  const app = await NestFactory.create(SessionManagerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
