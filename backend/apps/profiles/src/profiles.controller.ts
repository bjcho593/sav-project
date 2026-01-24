import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProfilesService } from './profiles.service';

@Controller()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @MessagePattern({ cmd: 'get_user_profile' })
  getUserProfile(@Payload() data: { userId: string }) {
    console.log(`👤 [PROFILES] Fetching profile for: ${data.userId}`);
    return this.profilesService.getProfile(data.userId);
  }
}
