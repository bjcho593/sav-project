import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as QRCode from 'qrcode';

// Entidades
import { User } from './users/user.entity';
import { AttendanceRecord } from './attendance/attendance.entity';
import { Session } from './attendance/session.entity';

@Injectable()
export class IdentityService {
  
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(AttendanceRecord) private attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
    private jwtService: JwtService,

    // Clientes de Microservicios
    @Inject('ANALYTICS_SERVICE') private analyticsClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE') private notificationsClient: ClientProxy,
    @Inject('REPORTS_SERVICE') private reportsClient: ClientProxy,
    @Inject('AUDIT_SERVICE') private auditClient: ClientProxy,
    @Inject('SESSION_SERVICE') private sessionClient: ClientProxy,
    @Inject('ENROLLMENT_SERVICE') private enrollmentClient: ClientProxy, // 👈 NUEVO
  ) {}

  // --- 1. GENERAR QR ---
  async generateClassQr(scheduleId: string): Promise<{ qrImage: string, sessionId: string }> { 
    let session = await this.sessionRepository.findOne({
      where: { scheduleId: scheduleId, status: 'OPEN' }
    });

    if (!session) {
      const newSession = this.sessionRepository.create({
        scheduleId: scheduleId,
        actualDate: new Date(),
        status: 'OPEN'
      });
      session = await this.sessionRepository.save(newSession);
    }

    const payload = { sessionId: session.id, courseId: 'PROG-202', generatedAt: Date.now() };
    const signedToken = this.jwtService.sign(payload);
    const qrImage = await QRCode.toDataURL(signedToken);

    return { qrImage, sessionId: session.id };
  }

  // --- 2. REGISTRAR ASISTENCIA ---
  async registerAttendance(data: { userId: string, qrContent: string }): Promise<any> {
    
    // Validar existencia del usuario
    const userExists = await this.usersRepository.findOne({ where: { id: data.userId } });
    if (!userExists) {
        await this.usersRepository.save({
            id: data.userId,
            email: `alumno_${data.userId}@sav.com`,
            fullName: 'Estudiante SAV',
            role: 'STUDENT',
            password: 'password123'
        });
    }

    try {
      // A. Decodificar QR
      let decoded: any;
      try {
        decoded = this.jwtService.verify(data.qrContent);
      } catch (e) {
        throw new BadRequestException('Código QR expirado o inválido.');
      }

      const { sessionId, courseId, generatedAt } = decoded;

      // =========================================================
      // B. VALIDACIÓN DE TIEMPO (Session Manager) ⏳
      // =========================================================
      const sessionValidation = await firstValueFrom(
        this.sessionClient.send({ cmd: 'validate_session_status' }, { sessionId, timestamp: generatedAt })
      );
      if (!sessionValidation.valid) throw new BadRequestException('QR fuera de tiempo.');

      // =========================================================
      // C. VALIDACIÓN DE MATRÍCULA (Enrollment) 📋
      // =========================================================
      const enrollmentValidation = await firstValueFrom(
        this.enrollmentClient.send({ cmd: 'check_student_enrollment' }, { studentId: data.userId, courseId })
      );
      if (!enrollmentValidation.enrolled) throw new BadRequestException('No estás matriculado en esta materia.');

      // D. Persistencia y Duplicados
      const existing = await this.attendanceRepository.findOne({
        where: { session: { id: sessionId }, student: { id: data.userId } }
      });
      if (existing) return { status: 'ALREADY_REGISTERED', message: 'Asistencia ya marcada.' };

      const newRecord = this.attendanceRepository.create({
        student: { id: data.userId } as User,
        session: { id: sessionId } as Session,
        status: 'PRESENT',
        timestamp: new Date()
      });
      await this.attendanceRepository.save(newRecord);

      // E. Eventos Asíncronos
      const eventData = { studentId: data.userId, sessionId, timestamp: new Date() };
      this.analyticsClient.emit('attendance_registered', eventData).subscribe();
      this.notificationsClient.emit('attendance_registered', eventData).subscribe();
      this.reportsClient.emit('attendance_registered', eventData).subscribe();
      this.auditClient.emit('attendance_registered', eventData).subscribe();
      
      return { status: 'SUCCESS', message: 'Asistencia válida y registrada.' };

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}