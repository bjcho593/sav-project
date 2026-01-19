import { NestFactory } from '@nestjs/core';
import { AcademicModule } from './academic.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AcademicMicroservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AcademicModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // Permite conexiones dentro de Docker
      port: 3008,
    },
  });
  await app.listen();
  logger.log('📚 Academic Microservice is listening on port 3008');
}
bootstrap();