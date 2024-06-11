import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentSchema, PaymentDTO } from './dtos/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('process')
  async processPayment(@Body() paymentInfo: PaymentDTO) {
    try {
      PaymentSchema.parse(paymentInfo);
      return await this.paymentService.processPayment(paymentInfo);
    } catch (error) {
      throw new BadRequestException(error.errors);
    }
  }
}
