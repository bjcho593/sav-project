import { Injectable } from '@nestjs/common';

@Injectable()
export class AcademicService {
  private subjects = [
    { id: 'PROG-202', name: 'Software Architecture', faculty: 'Engineering' },
    { id: 'MAT-101', name: 'Calculus I', faculty: 'Science' },
  ];

  findOneSubject(id: string) {
    return this.subjects.find(s => s.id === id) || { error: 'Subject not found' };
  }
}