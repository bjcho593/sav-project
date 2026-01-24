import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  
  @EventPattern('attendance_registered') // Escuchamos el evento
  handleAttendance(@Payload() data: any) {
    // Simulamos el envío de correo
    console.log('------------------------------------------------');
    console.log('[NOTIFICATIONS] Event received.');
    console.log(`Sending confirmation email to Student ID: ${data.studentId}`);
    console.log(`Date: ${new Date().toISOString()}`);
    console.log('Email sent successfully (Simulated)');
    console.log('------------------------------------------------');
  }
}