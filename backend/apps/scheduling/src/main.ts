import { NestFactory } from '@nestjs/core';
import { SchedulingModule } from './scheduling.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SchedulingService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(SchedulingModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Importante para Docker
      port: 3007,
    },
  });
  await app.listen();
  logger.log('🕒 Scheduling Microservice is listening on port 3007');
}
bootstrap();
