import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Eliminamos el schema 'academic' para evitar el error de base de datos
@Entity({ name: 'courses' }) 
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  credits: number;
}