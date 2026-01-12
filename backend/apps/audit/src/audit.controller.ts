import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuditController {
  
  @EventPattern('attendance_registered')
  handleAuditLog(@Payload() data: any) {
    console.log('------------------------------------------------');
    console.log('🚨 [SECURITY AUDIT LOG] 🚨');
    console.log(`Action: ATTENDANCE_CHECK_IN`);
    console.log(`Student ID: ${data.studentId}`);
    console.log(`Session ID: ${data.sessionId}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Status: VERIFIED_SUCCESS`);
    console.log(`Trace ID: ${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
    console.log('------------------------------------------------');
  }
}
