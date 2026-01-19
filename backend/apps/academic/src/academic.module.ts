import { Module } from '@nestjs/common';
import { AcademicController } from './academic.controller';
import { AcademicService } from './academic.service'; // Debería ser idéntico al nombre del archivo sin .ts

@Module({
  controllers: [AcademicController],
  providers: [AcademicService],
})
export class AcademicModule {}