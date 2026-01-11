import { NestFactory } from '@nestjs/core';
import { AnalyticsModule } from './analytics.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AnalyticsModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001,
      },
    },
  );

  await app.listen();
  console.log('📊 Analytics Microservice is listening via TCP on port 3001');
}
bootstrap();