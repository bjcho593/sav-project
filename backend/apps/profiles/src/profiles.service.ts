import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfilesService {
  private profiles = [
    { 
      userId: '12345', 
      fullName: 'Steven Smith', 
      bio: 'Ingeniería de Software - 8vo Semestre', 
      phone: '+593 999 999 999',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steven' 
    }
  ];

  getProfile(userId: string) {
    return this.profiles.find(p => p.userId === userId) || { error: 'PROFILE_NOT_FOUND' };
  }
}