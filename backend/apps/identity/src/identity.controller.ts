import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { User } from './users/user.entity';
import { ScanQrDto } from './dto/scan-qr.dto';

@Controller()
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  // ... otros endpoints ...

  // 1. Endpoint del QR (Simplificado)
  @Get('qr')
  getQr(@Query('classId') classId: string) {
    // Ya no hace falta crear el objeto { qrImage: ... } aquí
    // El servicio ya nos devuelve { qrImage, sessionId } listo para React
    return this.identityService.generateClassQr(classId);
  }

  // 2. Nuevo Endpoint para la Lista
  @Get('session/:id/attendees')
  getAttendees(@Param('id') sessionId: string) {
    return this.identityService.getSessionAttendees(sessionId);
  }

  @Post('register') // Se llamará: POST http://localhost:3000/register
  registerScan(@Body() scanData: ScanQrDto) {
    return this.identityService.registerAttendance(scanData);
  }
  
}
