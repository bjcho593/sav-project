import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import * as crypto from 'crypto';

@Controller()
export class AuditController {

  @EventPattern('attendance_registered')
  async logSecurityEvent(@Payload() data: any) {
    // Generamos un Hash SHA-256 para asegurar la integridad del registro
    const logHash = crypto.createHash('sha256')
      .update(`${data.studentId}-${data.sessionId}-${data.timestamp}`)
      .digest('hex');

    console.log('------------------------------------------------');
    console.log('[AUDIT LOG] Registro de Seguridad Generado');
    console.log(`Integrity Hash: ${logHash.substring(0, 16)}...`);
    console.log(`Auditoría para Alumno: ${data.studentId}`);
    console.log(`Estado: REGISTRO_INMUTABLE_GENERADO`);
    console.log('------------------------------------------------');
  }
}
