import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CoursesService } from 'src/http/services/courses.service';
import { EnrollmentsService } from 'src/http/services/enrollments.service';
import { StudentsService } from 'src/http/services/students.service';
import { PurchasesController } from './controllers/purchases.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PurchasesController],
  providers:[
    StudentsService,
    CoursesService,
    EnrollmentsService
  ]
})
export class MessagingModule {}
