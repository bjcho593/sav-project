import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices'; 

// Entidades
import { Session } from './attendance/session.entity';
import { User } from './users/user.entity';
import { AttendanceRecord } from './attendance/attendance.entity';
import { Course } from './academic/course.entity';
import { Schedule } from './academic/schedule.entity';

// Controladores y Servicios
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';

// Submódulos
import { AcademicModule } from './academic/academic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 1. BASE DE DATOS - Configurada para la red de Docker
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Cambiado de localhost a postgres (nombre del servicio en docker-compose)
      host: process.env.DB_HOST || 'postgres', 
      // Cambiado de 5435 a 5432 (puerto interno del contenedor)
      port: parseInt(process.env.DB_PORT || '5432'), 
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password123',
      database: process.env.DB_NAME || 'sav_db',
      entities: [User, AttendanceRecord, Course, Schedule, Session],
      synchronize: true,
    }),

    // 2. REPOSITORIOS
    TypeOrmModule.forFeature([User, AttendanceRecord, Session]),

    // 3. JWT
    JwtModule.register({
      secret: 'SECRET_KEY_TESIS_2025',
      signOptions: { expiresIn: '60m' },
    }),

    // 4. SUBMÓDULOS
    AcademicModule,

    // 5. MICROSERVICIOS 📡 - Registro de Clientes TCP
    // Importante: Se usa el nombre del contenedor como host para comunicación interna
    ClientsModule.register([
      {
        name: 'ANALYTICS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'sav-analytics', port: 3001 },
      },
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'sav-notifications', port: 3002 },
      },
      {
        name: 'REPORTS_SERVICE',
        transport: Transport.TCP,
        options: { host: 'sav-reports', port: 3003 },
      },
      {
        name: 'AUDIT_SERVICE',
        transport: Transport.TCP,
        options: { host: 'sav-audit', port: 3004 },
      },
      {
        name: 'SESSION_SERVICE',
        transport: Transport.TCP,
        options: { host: 'sav-session', port: 3005 },
      },
      {
        name: 'ENROLLMENT_SERVICE',
        transport: Transport.TCP,
        options: { host: 'sav-enrollment', port: 3006 },
      },
      {
        name: 'SCHEDULING_SERVICE',
        transport: Transport.TCP,
        options: { host: 'sav-scheduling', port: 3007 },
      },
    ]),
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}