import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dtos/payment.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('processPayment')
  async handleProcessPayment(data: PaymentDto) {
    return await this.paymentService.processPayment(data);
  }
}
