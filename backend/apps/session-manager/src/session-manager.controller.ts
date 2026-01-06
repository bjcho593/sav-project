import { Controller, Get } from '@nestjs/common';
import { SessionManagerService } from './session-manager.service';

@Controller()
export class SessionManagerController {
  constructor(private readonly sessionManagerService: SessionManagerService) {}

  @Get()
  getHello(): string {
    return this.sessionManagerService.getHello();
  }
}
