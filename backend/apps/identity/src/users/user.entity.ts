import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'users', schema: 'identity' }) // <--- ¡Aquí ocurre la magia! Mapeamos esquema y tabla
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' }) // En la DB se llama password_hash
  passwordHash: string;              // En el código la llamamos passwordHash

  @Column({ default: 'STUDENT' })
  role: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}