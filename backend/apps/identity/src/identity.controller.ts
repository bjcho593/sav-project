import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { ScanQrDto } from './dto/scan-qr.dto'; // <--- Ahora sí existe

@Controller('api') // <--- Agregamos prefijo global /api
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  // 1. Endpoint para Generar QR (Profesor)
  // URL: GET http://localhost:3000/api/qr?classId=HORARIO_UUID
  @Get('qr')
  getQr(@Query('classId') classId: string) {
    return this.identityService.generateClassQr(classId);
  }

  // 2. Endpoint para Registrar Asistencia (Alumno)
  // URL: POST http://localhost:3000/api/register
  @Post('register') 
  registerScan(@Body() scanData: ScanQrDto) {
    // scanData ya trae { userId, qrContent } validado
    return this.identityService.registerAttendance(scanData);
  }

  // 3. Endpoint para Ver la Lista en Vivo (Polling del Frontend)
  // URL: GET http://localhost:3000/api/session/SESION_UUID/attendees
  @Get('session/:id/attendees')
  getAttendees(@Param('id') sessionId: string) {
    return this.identityService.getSessionAttendees(sessionId);
  }
}
