import { Module } from '@nestjs/common';
import { SessionManagerController } from './session-manager.controller';
import { SessionManagerService } from './session-manager.service';

@Module({
  imports: [],
  controllers: [SessionManagerController],
  providers: [SessionManagerService],
})
export class SessionManagerModule {}
