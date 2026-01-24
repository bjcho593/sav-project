import { NestFactory } from '@nestjs/core';
import { SessionManagerModule } from './session-manager.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SessionManagerModule,
    {
      transport: Transport.TCP,
      options: { 
        host: '0.0.0.0', 
        port: 3005 // Puerto asignado para gestión de sesiones
      },
    },
  );
  await app.listen();
  console.log('🏫 Session Manager Microservice is listening on port 3005');
}
bootstrap();