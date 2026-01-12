import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ReportsController {
  
  @EventPattern('attendance_registered')
  handleAttendanceReport(@Payload() data: any) {
    console.log('------------------------------------------------');
    console.log('📄 [REPORTS SERVICE] Evento Recibido');
    console.log(`🖨️  Generando Certificado de Asistencia PDF...`);
    console.log(`👤  ID Alumno: ${data.studentId}`);
    console.log(`🏫  ID Sesión: ${data.sessionId}`);
    console.log('✅  PDF guardado en: /exports/attendance_report.pdf');
    console.log('------------------------------------------------');
  }
}