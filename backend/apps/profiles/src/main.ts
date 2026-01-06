import { NestFactory } from '@nestjs/core';
import { ProfilesModule } from './profiles.module';

async function bootstrap() {
  const app = await NestFactory.create(ProfilesModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
