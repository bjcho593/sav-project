import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AnalyticsService } from './analytics.service';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // BORRAMOS EL MÉTODO 'getHello' QUE DABA ERROR
  
  // PONEMOS EL NUEVO MÉTODO QUE ESCUCHA EVENTOS
  @EventPattern('attendance_registered')
  handleAttendance(@Payload() data: any) {
    console.log('------------------------------------------------');
    console.log('📊 [ANALYTICS] Evento recibido desde Identity Service');
    
    // Llamamos a la función que SÍ existe en el servicio
    this.analyticsService.processAttendanceStats(data);
  }
}