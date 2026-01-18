import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AnalyticsController {
  // Simulación de base de datos en memoria para la demo
  private attendanceStats = { total: 0, students: new Set() };

  @EventPattern('attendance_registered')
  handleAnalytics(@Payload() data: any) {
    this.attendanceStats.total++;
    this.attendanceStats.students.add(data.studentId);

    console.log('------------------------------------------------');
    console.log('[ANALYTICS] Procesando métricas...');
    console.log(`Asistencias Totales hoy: ${this.attendanceStats.total}`);
    console.log(`Estudiantes Únicos detectados: ${this.attendanceStats.students.size}`);
    console.log('------------------------------------------------');
  }
}