import { Injectable } from '@nestjs/common';

@Injectable()
export class AcademicService {
  private subjects = [
    { id: 'PROG-202', name: 'Software Architecture', faculty: 'Engineering', teacher: 'Dr. Smith' },
    { id: 'MAT-101', name: 'Calculus I', faculty: 'Science', teacher: 'Dr. Jones' },
  ];

  findOneSubject(id: string) {
    return this.subjects.find(s => s.id === id) || { error: 'Subject not found' };
  }

  // ESTE ES EL NOMBRE QUE BUSCA EL CONTROLADOR
  getFullCatalog() {
    return this.subjects;
  }
}