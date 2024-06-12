import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentDto } from './dtos/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  async processPayment(paymentDto: PaymentDto) {
    try {
      // Verificar se todos os campos obrigatórios estão presentes
      const payment = await this.prisma.payment.create({
        data: {
          vehicleId: paymentDto.vehicleId,
          amount: paymentDto.amount,
          method: paymentDto.method,
        },
      });

      // Emitir evento para fila RabbitMQ após o pagamento ser processado
      await this.client.emit('paymentProcessed', payment).toPromise();

      return payment;
    } catch (error) {
      // Tratamento de erros básico
      console.error('Error processing payment', error);
      throw error;
    }
  }
}
