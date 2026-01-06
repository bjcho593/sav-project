import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  // Busca todos los horarios asignados a un profesor específico
  async getTeacherClasses(teacherId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { teacherId: teacherId },
      relations: ['course'], // ¡Traemos también los datos del curso (nombre)!
      order: { startTime: 'ASC' }
    });
  }
}