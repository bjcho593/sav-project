import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs'; // Necesario para convertir observables en promesas
import * as QRCode from 'qrcode';

// Entidades
import { User } from './users/user.entity';
import { AttendanceRecord } from './attendance/attendance.entity';
import { Session } from './attendance/session.entity';

@Injectable()
export class IdentityService {
  
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(AttendanceRecord)
    private attendanceRepository: Repository<AttendanceRecord>,

    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,

    private jwtService: JwtService,

    // Inyección de los clientes de Microservicios
    @Inject('ANALYTICS_SERVICE') private analyticsClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE') private notificationsClient: ClientProxy,
    @Inject('REPORTS_SERVICE') private reportsClient: ClientProxy,
    @Inject('AUDIT_SERVICE') private auditClient: ClientProxy,
    @Inject('SESSION_SERVICE') private sessionClient: ClientProxy, // 👈 Nuevo Cliente
  ) {}

  // --- 1. GENERAR QR ---
  async generateClassQr(scheduleId: string): Promise<{ qrImage: string, sessionId: string }> { 
    let session = await this.sessionRepository.findOne({
      where: { scheduleId: scheduleId, status: 'OPEN' }
    });

    if (!session) {
      console.log('✨ Creando nueva sesión de clase...');
      const newSession = this.sessionRepository.create({
        scheduleId: scheduleId,
        actualDate: new Date(),
        status: 'OPEN'
      });
      session = await this.sessionRepository.save(newSession);
    }

    const payload = { 
      sessionId: session.id, 
      generatedAt: Date.now() 
    };

    const signedToken = this.jwtService.sign(payload);

    console.log('================================================');
    console.log('🔑 TOKEN PARA COPIAR EN POSTMAN (Cópialo todo):');
    console.log(signedToken);
    console.log('================================================');

    const qrImage = await QRCode.toDataURL(signedToken);

    return { qrImage: qrImage, sessionId: session.id };
  }

  // --- 2. REGISTRAR ASISTENCIA ---
  async registerAttendance(data: { userId: string, qrContent: string }): Promise<any> {
    
    // 🛠️ AUTO-GENERACIÓN DE USUARIO (Si no existe)
    const userExists = await this.usersRepository.findOne({ where: { id: data.userId } });
    
    if (!userExists) {
        console.log(`⚠️ Usuario ${data.userId} no encontrado. Creándolo automáticamente...`);
        await this.usersRepository.save({
            id: data.userId,
            email: `alumno_${data.userId}@sav.com`, 
            fullName: 'Alumno Generado Automáticamente',
            role: 'STUDENT',
            password: 'password123'
        });
        console.log('✅ Usuario creado con éxito.');
    }

    try {
      // A. Verificar Token JWT
      let decoded: any;
      try {
        decoded = this.jwtService.verify(data.qrContent);
      } catch (e) {
        throw new BadRequestException('El código QR ha expirado o es inválido.');
      }

      const sessionId = decoded.sessionId;

      // =========================================================
      // B. VALIDACIÓN CON SESSION MANAGER (Microservicio) 🏫
      // =========================================================
      // Enviamos el sessionId y el tiempo de generación al Manager
      const sessionValidation = await firstValueFrom(
        this.sessionClient.send(
          { cmd: 'validate_session_status' }, 
          { sessionId, timestamp: decoded.generatedAt }
        )
      );

      if (!sessionValidation.valid) {
        throw new BadRequestException(`Acceso denegado: ${sessionValidation.reason}`);
      }

      console.log(`✅ Sesión validada por Session Manager en: ${sessionValidation.room}`);

      // C. Buscar sesión en DB local
      const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
      if (!session) throw new NotFoundException('La sesión de clase no existe o ya cerró.');

      // D. Verificar duplicados
      const existing = await this.attendanceRepository.findOne({
        where: { 
          session: { id: sessionId }, 
          student: { id: data.userId } 
        }
      });

      if (existing) {
        return { status: 'ALREADY_REGISTERED', message: 'Ya registraste asistencia en esta clase.' };
      }

      // E. Guardar Registro en Base de Datos
      const newRecord = this.attendanceRepository.create({
        student: { id: data.userId } as User,
        session: { id: sessionId } as Session,
        status: 'PRESENT',
        timestamp: new Date()
      });

      await this.attendanceRepository.save(newRecord);

      // =========================================================
      // F. COMUNICACIÓN CON MICROSERVICIOS DE EVENTOS 📡
      // =========================================================
      
      const eventData = {
        studentId: data.userId,
        sessionId: sessionId,
        timestamp: new Date(),
        status: 'PRESENT'
      };

      // Emitir eventos asíncronos (Fire and forget)
      this.analyticsClient.emit('attendance_registered', eventData).subscribe();
      this.notificationsClient.emit('attendance_registered', eventData).subscribe();
      this.reportsClient.emit('attendance_registered', eventData).subscribe();
      this.auditClient.emit('attendance_registered', eventData).subscribe();
      
      return {
        status: 'SUCCESS',
        message: 'Asistencia registrada correctamente',
        student: data.userId,
        session: sessionId,
        details: sessionValidation // Incluye info del aula retornada por el microservicio
      };

    } catch (error) {
      console.error('❌ ERROR REGISTRO:', error.message);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  // --- 3. OBTENER LISTA ---
  async getSessionAttendees(sessionId: string): Promise<AttendanceRecord[]> {
    return this.attendanceRepository.find({
      where: { session: { id: sessionId } },
      relations: ['student'],
      order: { timestamp: 'DESC' }
    });
  }
}