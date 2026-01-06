import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'sessions', schema: 'attendance' })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'schedule_id', type: 'uuid' })
  scheduleId: string; // El ID de la clase (Horario)

  @CreateDateColumn({ name: 'actual_date', type: 'date' })
  actualDate: Date; // Fecha de hoy

  @Column({ default: 'OPEN' })
  status: string; // OPEN o CLOSED
}