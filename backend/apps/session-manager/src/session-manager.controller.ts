import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class SessionManagerController {
  
  @MessagePattern({ cmd: 'validate_session_status' })
  validateSession(@Payload() data: { sessionId: string, timestamp: number }) {
    const expirationTime = 15 * 60 * 1000; // 15 minutos en milisegundos
    const currentTime = Date.now();
    
    // Lógica: Si el QR tiene más de 15 min, la sesión para ese registro expira
    const isExpired = (currentTime - data.timestamp) > expirationTime;

    console.log(`🔍 [SESSION MANAGER] Validating session: ${data.sessionId}`);
    
    if (isExpired) {
      console.log('❌ Session access expired by time limit.');
      return { valid: false, reason: 'QR_EXPIRED' };
    }

    return { valid: true, room: 'Aula Virtual 101', teacher: 'Dr. Smith' };
  }
}