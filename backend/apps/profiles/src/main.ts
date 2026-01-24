import { NestFactory } from '@nestjs/core';
import { ProfilesModule } from './profiles.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('ProfilesService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProfilesModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3011,
    },
  });
  await app.listen();
  logger.log('👤 Profiles Microservice is listening on port 3011');
}
bootstrap();
