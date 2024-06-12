import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreatePaymentDto } from './dtos/payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    // Verifique se createPaymentDto.vehicleId está definido
    const { vehicleId, amount, method } = createPaymentDto;

    const paymentInfo = {
      vehicleId: vehicleId || undefined, // Pode ser undefined se não estiver definido em createPaymentDto
      amount,
      method,
    };

    return this.prisma.payment.create({ data: paymentInfo });
  }
}
