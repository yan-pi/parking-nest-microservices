import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/payment.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaymentService {
  constructor(private readonly httpService: HttpService) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const response = await firstValueFrom(
      this.httpService.post('http://payment-service/payment', createPaymentDto),
    );
    return response.data;
  }
}
