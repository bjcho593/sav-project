import { NestFactory } from '@nestjs/core';
import { EnrollmentModule } from './enrollment.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('EnrollmentService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EnrollmentModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3006,
    },
  });
  await app.listen();
  logger.log('📋 Enrollment Microservice is listening on port 3006');
}
bootstrap();
