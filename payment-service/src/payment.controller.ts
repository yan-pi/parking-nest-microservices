import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('processPayment')
  async handleProcessPayment(data: {
    vehicleId: number;
    amount: number;
    method: string;
  }) {
    return await this.paymentService.processPayment(
      data.vehicleId,
      data.amount,
      data.method,
    );
  }
}
