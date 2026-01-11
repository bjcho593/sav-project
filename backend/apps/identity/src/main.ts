import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // <--- Importar esto

async function bootstrap() {
  const app = await NestFactory.create(IdentityModule);
  
  app.enableCors(); // Ya lo tenías para React

  // --- CONFIGURACIÓN SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('SAV API - Tesis')
    .setDescription('Documentación de la API del Sistema de Asistencia')
    .setVersion('1.0')
    .addBearerAuth() // Para que funcione el botón de poner el Token JWT
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  // -----------------------------

  await app.listen(3000);
}
bootstrap();