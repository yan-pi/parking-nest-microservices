import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async processPayment(vehicleId: number, amount: number, method: string) {
    return this.prisma.payment.create({
      data: { vehicleId, amount, method },
    });
  }
}
