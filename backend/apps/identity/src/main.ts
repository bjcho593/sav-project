import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';

async function bootstrap() {
  const app = await NestFactory.create(IdentityModule);
  
  // ¡ESTA LÍNEA ES LA CLAVE!
  // Permite que cualquier página web (Frontend) se conecte a este backend.
  app.enableCors(); 

  await app.listen(3000);
}
bootstrap();