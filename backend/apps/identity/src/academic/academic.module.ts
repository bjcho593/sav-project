import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Schedule } from './schedule.entity';
import { AcademicService } from './academic.service';
import { AcademicController } from './academic.controller';

@Module({
  imports: [
    // Registramos las entidades para que este módulo pueda consultarlas
    TypeOrmModule.forFeature([Course, Schedule]),
  ],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [AcademicService], // Exportamos el servicio por si otros lo necesitan
})
export class AcademicModule {}