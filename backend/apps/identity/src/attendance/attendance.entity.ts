import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity'

@Entity({ name: 'records', schema: 'attendance' }) // Apunta al esquema 'attendance'
export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string; // ID de la clase del día

  @Column({ name: 'student_id', type: 'uuid' })
  studentId: string; // ID del alumno

  @CreateDateColumn({ name: 'check_in_time' })
  checkInTime: Date;

  @Column({ default: 'PRESENT' })
  status: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;
  
}