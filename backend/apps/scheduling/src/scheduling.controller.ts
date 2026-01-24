import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class SchedulingController {
  
  // Simulación de horarios de materias
  private classSchedules = [
    { courseId: 'PROG-202', day: 1, startTime: '07:00', endTime: '22:00' }, // Lunes (1) extendido para pruebas
    { courseId: 'MAT-101', day: 2, startTime: '08:00', endTime: '10:00' },
  ];

  @MessagePattern({ cmd: 'validate_schedule' })
  validateSchedule(@Payload() data: { courseId: string }) {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes...
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    console.log(`📅 [SCHEDULING] Validando horario para ${data.courseId} a las ${currentTime}`);

    const schedule = this.classSchedules.find(s => s.courseId === data.courseId);

    if (!schedule) return { valid: false, message: 'HORARIO_NO_DEFINIDO' };

    // Validar día y rango de horas
    const isCorrectDay = schedule.day === currentDay;
    const isWithinTime = currentTime >= schedule.startTime && currentTime <= schedule.endTime;

    if (!isCorrectDay || !isWithinTime) {
      return { valid: false, message: 'FUERA_DE_HORARIO_PERMITIDO' };
    }

    return { valid: true, message: 'HORARIO_CORRECTO' };
  }
}
