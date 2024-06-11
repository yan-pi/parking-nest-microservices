import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentSchema, CreatePaymentDto } from './dtos/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() body: any) {
    try {
      const createPaymentDto: CreatePaymentDto =
        CreatePaymentSchema.parse(body);
      return await this.paymentService.createPayment(createPaymentDto);
    } catch (error) {
      throw new BadRequestException(error.errors);
    }
  }
}
