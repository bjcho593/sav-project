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

    // Inyección de los 7 Clientes de Microservicios 📡
    @Inject('ANALYTICS_SERVICE') private analyticsClient: ClientProxy,
    @Inject('NOTIFICATIONS_SERVICE') private notificationsClient: ClientProxy,
    @Inject('REPORTS_SERVICE') private reportsClient: ClientProxy,
    @Inject('AUDIT_SERVICE') private auditClient: ClientProxy,
    @Inject('SESSION_SERVICE') private sessionClient: ClientProxy,
    @Inject('ENROLLMENT_SERVICE') private enrollmentClient: ClientProxy,
    @Inject('SCHEDULING_SERVICE') private schedulingClient: ClientProxy,
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

    // El Payload incluye el CourseId para las validaciones posteriores
    const payload = { 
      sessionId: session.id, 
      courseId: 'PROG-202', // En producción esto viene del objeto schedule
      generatedAt: Date.now() 
    };

    const signedToken = this.jwtService.sign(payload);

    console.log('================================================');
    console.log('🔑 TOKEN GENERADO CON ÉXITO');
    console.log('================================================');

    const qrImage = await QRCode.toDataURL(signedToken);

    return { qrImage, sessionId: session.id };
  }

  // --- 2. REGISTRAR ASISTENCIA (Flujo Maestro) ---
  async registerAttendance(data: { userId: string, qrContent: string }): Promise<any> {
    
    // Validar existencia del usuario / Auto-registro
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
      // A. Decodificar y Validar Firma JWT
      let decoded: any;
      try {
        decoded = this.jwtService.verify(data.qrContent);
      } catch (e) {
        throw new BadRequestException('El código QR es falso, ha sido manipulado o es inválido.');
      }

      const { sessionId, courseId, generatedAt } = decoded;

      // =========================================================
      // B. CAPA 1: VALIDACIÓN DE TIEMPO (Session Manager) ⏳
      // =========================================================
      const sessionVal = await firstValueFrom(
        this.sessionClient.send({ cmd: 'validate_session_status' }, { sessionId, timestamp: generatedAt })
      );
      if (!sessionVal.valid) throw new BadRequestException(`QR inválido: ${sessionVal.reason}`);

      // =========================================================
      // C. CAPA 2: VALIDACIÓN DE HORARIO (Scheduling) 🕒
      // =========================================================
      const scheduleVal = await firstValueFrom(
        this.schedulingClient.send({ cmd: 'validate_schedule' }, { courseId })
      );
      if (!scheduleVal.valid) throw new BadRequestException(`Horario no permitido: ${scheduleVal.message}`);

      // =========================================================
      // D. CAPA 3: VALIDACIÓN DE MATRÍCULA (Enrollment) 📋
      // =========================================================
      const enrollmentVal = await firstValueFrom(
        this.enrollmentClient.send({ cmd: 'check_student_enrollment' }, { studentId: data.userId, courseId })
      );
      if (!enrollmentVal.enrolled) throw new BadRequestException('El estudiante no figura en la lista de esta materia.');

      // =========================================================
      // E. PERSISTENCIA LOCAL Y DUPLICADOS 🗄️
      // =========================================================
      const existing = await this.attendanceRepository.findOne({
        where: { session: { id: sessionId }, student: { id: data.userId } }
      });

      if (existing) {
        return { status: 'ALREADY_REGISTERED', message: 'Usted ya marcó asistencia previamente.' };
      }

      const newRecord = this.attendanceRepository.create({
        student: { id: data.userId } as User,
        session: { id: sessionId } as Session,
        status: 'PRESENT',
        timestamp: new Date()
      });

      await this.attendanceRepository.save(newRecord);

      // =========================================================
      // F. DISPARO DE EVENTOS ASÍNCRONOS 📡 (Fire and Forget)
      // =========================================================
      const eventData = { 
        studentId: data.userId, 
        sessionId, 
        courseId,
        timestamp: new Date(),
        status: 'PRESENT'
      };

      this.analyticsClient.emit('attendance_registered', eventData).subscribe();
      this.notificationsClient.emit('attendance_registered', eventData).subscribe();
      this.reportsClient.emit('attendance_registered', eventData).subscribe();
      this.auditClient.emit('attendance_registered', eventData).subscribe();
      
      console.log(`✅ Registro exitoso para ${data.userId}. Microservicios notificados.`);

      return { 
        status: 'SUCCESS', 
        message: 'Asistencia registrada con éxito tras validación académica completa.',
        details: {
          room: sessionVal.room,
          schedule: scheduleVal.message
        }
      };

    } catch (error) {
      console.error('❌ ERROR EN PROCESO:', error.message);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error interno al validar la asistencia.');
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