import { NestFactory } from '@nestjs/core';
import { AuditModule } from './audit.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuditModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3004, // Puerto exclusivo para Auditoría
      },
    },
  );
  await app.listen();
  console.log('🛡️ Audit Microservice is listening on port 3004');
}
bootstrap();
