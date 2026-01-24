import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3002, // ⚠️ IMPORTANTE: Puerto único para Notifications
      },
    },
  );
  await app.listen();
  console.log('🔔 Notifications Microservice is listening on port 3002');
}
bootstrap();
