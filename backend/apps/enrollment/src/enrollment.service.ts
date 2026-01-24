import { Injectable } from '@nestjs/common';

@Injectable()
export class EnrollmentService {
  private enrollmentData = [
    { courseId: 'PROG-202', students: ['12345', '67890'] },
    { courseId: 'MAT-101', students: ['12345'] },
  ];

  isStudentEnrolled(studentId: string, courseId: string): boolean {
    const course = this.enrollmentData.find(c => c.courseId === courseId);
    return course ? course.students.includes(studentId) : false;
  }
}