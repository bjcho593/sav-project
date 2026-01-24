import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulingService {
  // Simulación de horarios: Lunes a Viernes de 07:00 a 22:00
  private classSchedules = [
    { courseId: 'PROG-202', day: 1, startTime: '07:00', endTime: '09:00' }, // Lunes
    { courseId: 'MAT-101', day: 3, startTime: '10:00', endTime: '12:00' },  // Miércoles
  ];

  isWithinSchedule(courseId: string): { allowed: boolean; message?: string } {
    const now = new Date();
    const currentDay = now.getDay(); // 1 = Lunes, 2 = Martes...
    const currentTime = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');

    const schedule = this.classSchedules.find(s => s.courseId === courseId && s.day === currentDay);

    if (!schedule) {
      return { allowed: false, message: 'NO_CLASS_SCHEDULED_TODAY' };
    }

    if (currentTime >= schedule.startTime && currentTime <= schedule.endTime) {
      return { allowed: true };
    }

    return { allowed: false, message: 'OUTSIDE_CLASS_HOURS' };
  }
}
