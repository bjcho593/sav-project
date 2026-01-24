import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class EnrollmentController {
  
  // Simulación de una base de datos de inscritos
  // En producción, esto consultaría la tabla 'enrollments'
  private enrolledStudents = [
    { studentId: '12345', courses: ['MAT-101', 'PROG-202'] },
    { studentId: '67890', courses: ['MAT-101'] },
  ];

  @MessagePattern({ cmd: 'check_student_enrollment' })
  checkEnrollment(@Payload() data: { studentId: string, courseId: string }) {
    console.log(`🔍 [ENROLLMENT] Verificando inscripción del alumno ${data.studentId} en ${data.courseId}`);
    
    const record = this.enrolledStudents.find(s => s.studentId === data.studentId);
    const isEnrolled = record ? record.courses.includes(data.courseId) : false;

    if (!isEnrolled) {
      console.log('❌ Alumno no matriculado en esta materia.');
      return { enrolled: false, message: 'STUDENT_NOT_IN_LIST' };
    }

    return { enrolled: true, group: 'A', status: 'REGULAR' };
  }
}