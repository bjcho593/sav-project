import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Session } from './session.entity';

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'PRESENT' })
  status: string; // 'PRESENT', 'LATE', 'ABSENT'

  // AQUÍ ESTABA EL PROBLEMA: 
  // Nos aseguramos de que se llame 'timestamp' para coincidir con el servicio
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date; 

  // Relación con el Estudiante
  @ManyToOne(() => User, (user) => user.attendanceRecords)
  @JoinColumn({ name: 'studentId' })
  student: User;

  // Relación con la Sesión de Clase
  @ManyToOne(() => Session, (session) => session.attendanceRecords)
  @JoinColumn({ name: 'sessionId' })
  session: Session;
}