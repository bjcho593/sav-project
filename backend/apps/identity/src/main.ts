import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // Creamos la instancia del microservicio Identity (Gateway HTTP)
  const app = await NestFactory.create(IdentityModule);
  const logger = new Logger('Bootstrap');

  // --- 1. CONFIGURACIÓN DE CORS ---
  // Vital para que tu Frontend (Vite) pueda comunicarse con el Backend
  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // --- 2. CONFIGURACIÓN SWAGGER (Documentación) ---
  const config = new DocumentBuilder()
    .setTitle('SAV - Smart Attendance Verification')
    .setDescription(`
      Documentation for the SAV API (Thesis Project).
      This Gateway orchestrates 4-layer validation:
      1. JWT Signature
      2. Session TTL
      3. Enrollment Status
      4. Academic Scheduling
    `)
    .setVersion('1.0')
    .addTag('Attendance')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // --- 3. INICIO DEL SERVIDOR ---
  // Usamos process.env.PORT para mayor flexibilidad en Docker
  const PORT = process.env.PORT || 3000;

  // CAMBIO CRÍTICO: Escuchar en '0.0.0.0' para permitir conexiones externas al contenedor
  await app.listen(PORT, '0.0.0.0');
  
  logger.log(`==========================================================`);
  logger.log(`🚀 IDENTITY GATEWAY RUNNING ON: http://localhost:${PORT}`);
  logger.log(`📖 SWAGGER DOCUMENTATION: http://localhost:${PORT}/api/docs`);
  logger.log(`==========================================================`);
}
bootstrap();