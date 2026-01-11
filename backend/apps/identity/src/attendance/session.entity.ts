import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { AttendanceRecord } from './attendance.entity'; // <--- ¡No olvides importar esto!

@Entity('sessions') // Quitamos 'schema: attendance' para evitar errores de base de datos
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'schedule_id', type: 'uuid' })
  scheduleId: string;

  @CreateDateColumn({ name: 'actual_date', type: 'date' })
  actualDate: Date;

  @Column({ default: 'OPEN' })
  status: string; // 'OPEN' o 'CLOSED'

  // RELACIÓN BIDIRECCIONAL CORRECTA
  @OneToMany(() => AttendanceRecord, (record) => record.session)
  attendanceRecords: AttendanceRecord[];
}