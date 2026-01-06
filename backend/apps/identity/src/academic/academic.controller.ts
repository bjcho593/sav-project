import { Controller, Get, Param } from '@nestjs/common';
import { AcademicService } from './academic.service';

@Controller('academic') // Todo empezará con /academic
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  // GET http://localhost:3000/academic/teacher/:id
  @Get('teacher/:id') 
  getClasses(@Param('id') teacherId: string) {
    return this.academicService.getTeacherClasses(teacherId);
  }
}