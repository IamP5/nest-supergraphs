import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { CoursesService } from "src/http/services/courses.service";
import { EnrollmentsService } from "src/http/services/enrollments.service";
import { StudentsService } from "src/http/services/students.service";

interface PurchaseCreatedPayload {
  customer: Customer;
  product: Product;
}

interface Product {
  id: string;
  title: string;
  slug: string;
}

interface Customer {
  authUserId: string;
}

@Controller()
export class PurchasesController {

  constructor(
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService
  ) { }

  @EventPattern('purchases.new-purchase')
  async purchaseCreated(@Payload() payload: PurchaseCreatedPayload) {
    let student = await this.studentsService.getStudentByAuthUserId(payload.customer.authUserId);

    if(!student) {
      student = await this.studentsService.createStudent({
        authUserId: payload.customer.authUserId
      });
    }

    let course = await this.coursesService.getCourseBySlug(payload.product.slug);

    if(!course) {
      course = await this.coursesService.createCourse({
        title: payload.product.title
      });
    }

    await this.enrollmentsService.createEnrollment({
      courseId: course.id,
      studentId: student.id
    });
  }
}