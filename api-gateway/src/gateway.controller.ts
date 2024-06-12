// gateway.controller.ts

import { Controller } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller()
export class GatewayController {
  constructor(
    private readonly entryExitService: ClientProxy,
    private readonly parkingSpotService: ClientProxy,
    private readonly paymentService: ClientProxy,
  ) {}

  @MessagePattern('entry_exit')
  async handleEntryExitRequest(data: any) {
    return this.entryExitService.send('entry_exit', data).toPromise();
  }

  @MessagePattern('parking_spot')
  async handleParkingSpotRequest(data: any) {
    return this.parkingSpotService.send('parking_spot', data).toPromise();
  }

  @MessagePattern('payment')
  async handlePaymentRequest(data: any) {
    return this.paymentService.send('payment', data).toPromise();
  }
}
