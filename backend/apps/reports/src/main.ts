import { NestFactory } from '@nestjs/core';
import { ReportsModule } from './reports.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ReportsModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3003,
      },
    },
  );
  await app.listen();
  console.log('📄 Reports Microservice is listening on port 3003');
}
bootstrap();
