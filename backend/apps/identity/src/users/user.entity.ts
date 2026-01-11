import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AttendanceRecord } from '../attendance/attendance.entity'; // <--- Importar esto

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string; // El signo ? es porque a veces no traemos el password por seguridad

  @Column({ default: 'STUDENT' })
  role: string; // 'TEACHER', 'STUDENT', 'ADMIN'

  @Column({ nullable: true })
  fullName: string;

  // --- ESTA ES LA PROPIEDAD QUE FALTABA ---
  @OneToMany(() => AttendanceRecord, (record) => record.student)
  attendanceRecords: AttendanceRecord[];
}