import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AcademicService } from './academic.service';

@Controller()
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @MessagePattern({ cmd: 'get_subject_info' })
  getSubjectInfo(@Payload() data: { courseId: string }) {
    return this.academicService.findOneSubject(data.courseId);
  }

  @MessagePattern({ cmd: 'get_catalog_data' })
  getCatalog() {
    return this.academicService.getFullCatalog();
  }
}