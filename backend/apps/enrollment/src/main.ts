import { NestFactory } from '@nestjs/core';
import { EnrollmentModule } from './enrollment.module';

async function bootstrap() {
  const app = await NestFactory.create(EnrollmentModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
