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

    // 1. BASE DE DATOS
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5435, 
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
    ClientsModule.register([
      {
        name: 'ANALYTICS_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3001 },
      },
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3002 },
      },
      {
        name: 'REPORTS_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3003 },
      },
      {
        name: 'AUDIT_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3004 },
      },
      {
        name: 'SESSION_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3005 },
      },
      {
        name: 'ENROLLMENT_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3006 },
      },
    ]),
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}