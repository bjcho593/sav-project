import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'courses', schema: 'academic' })
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