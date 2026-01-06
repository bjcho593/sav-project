import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Session } from './attendance/session.entity';

// Importamos los Controladores y Servicios de este módulo
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';

// Importamos el Módulo Académico nuevo
import { AcademicModule } from './academic/academic.module';

// Importamos TODAS las entidades (Tablas de la base de datos)
import { User } from './users/user.entity';
import { AttendanceRecord } from './attendance/attendance.entity';
import { Course } from './academic/course.entity';
import { Schedule } from './academic/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // CONFIGURACIÓN DE BASE DE DATOS
    TypeOrmModule.forRoot({
      type: 'postgres', // <--- ¡ESTA ES LA LÍNEA QUE FALTABA!
      host: process.env.DB_HOST || 'localhost',
      port: 5435, 
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password123',
      database: process.env.DB_NAME || 'sav_db',
      
      // Aquí registramos las 4 tablas que hemos creado hasta ahora
      entities: [User, AttendanceRecord, Course, Schedule, Session],
      
      synchronize: false,
    }),

    // Registramos repositorios locales de Identity
    TypeOrmModule.forFeature([User, AttendanceRecord, Session]),

    // Configuración de Seguridad (JWT)
    JwtModule.register({
      secret: 'SECRET_KEY_TESIS_2025',
      signOptions: { expiresIn: '10s' },
    }),

    // Importamos el submódulo Académico
    AcademicModule,
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}