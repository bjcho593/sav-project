import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt'; 
import { User } from './users/user.entity';
import { AttendanceRecord } from './attendance/attendance.entity';
import { Session } from './attendance/session.entity';
import * as QRCode from 'qrcode';

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
  ) {}

  findAll(): Promise<User[]> { return this.usersRepository.find(); }

  // --- 1. GENERAR QR MEJORADO ---
  // Ahora devuelve un Objeto { imagen, id_sesion }
  async generateClassQr(scheduleId: string): Promise<{ qrImage: string, sessionId: string }> { 
    
    // A. Buscar o Crear Sesión (Lógica de siempre)
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

    // B. Generar Token
    const payload = { 
      sessionId: session.id, 
      generatedAt: Date.now() 
    };

    const signedToken = this.jwtService.sign(payload);
    console.log('📋 ID TOKEN:', signedToken);
    console.log(`🔑 QR GENERADO PARA SESIÓN: ${session.id}`);

    // C. Generar Imagen QR
    const qrImage = await QRCode.toDataURL(signedToken);

    // D. RETORNO NUEVO: Devolvemos el ID visible para el Frontend
    return {
      qrImage: qrImage,
      sessionId: session.id 
    };
  }

  // --- 2. REGISTRAR ASISTENCIA (Sin cambios) ---
  async registerAttendance(data: any): Promise<any> {
    try {
      const decoded = this.jwtService.verify(data.qrContent);
      const sessionId = decoded.sessionId;

      const existing = await this.attendanceRepository.findOne({
        where: { sessionId: sessionId, studentId: data.userId }
      });

      if (existing) {
        throw new Error('Ya registraste asistencia en esta clase.');
      }

      const newRecord = this.attendanceRepository.create({
        studentId: data.userId, 
        sessionId: sessionId,
        status: 'PRESENT'
      });

      await this.attendanceRepository.save(newRecord);

      return {
        status: 'SUCCESS',
        message: 'Asistencia registrada correctamente',
        student: data.userId,
        session: sessionId
      };

    } catch (error) {
      console.error('❌ ERROR:', error.message);
      return { status: 'ERROR', message: error.message };
    }
  }

  // --- 3. NUEVO MÉTODO: OBTENER LISTA DE ASISTENTES ---
  // Esto lo llamará el Frontend cada 2 segundos para actualizar la lista
  async getSessionAttendees(sessionId: string): Promise<AttendanceRecord[]> {
    return this.attendanceRepository.find({
      where: { sessionId: sessionId },
      relations: ['student'], // <--- IMPORTANTE: Trae el nombre del alumno (User)
      order: { checkInTime: 'DESC' } // Los últimos en llegar primero
    });
  }
}