import { NestFactory } from '@nestjs/core';
import { SchedulingModule } from './scheduling.module';

async function bootstrap() {
  const app = await NestFactory.create(SchedulingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
