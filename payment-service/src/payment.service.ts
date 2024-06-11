import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PaymentDTO } from './dtos/payment.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectQueue('entry-exit-queue') private entryExitQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async processPayment(paymentInfo: PaymentDTO) {
    // Lógica para processar pagamento
    await this.entryExitQueue.add('paymentProcessed', paymentInfo);
    return this.prisma.payment.create({ data: paymentInfo });
  }
}
