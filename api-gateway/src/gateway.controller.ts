import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller()
export class GatewayController {
  constructor(
    @Inject('ENTRY_EXIT_SERVICE')
    private readonly entryExitServiceClient: ClientProxy,
    @Inject('PARKING_SPOT_SERVICE')
    private readonly parkingSpotServiceClient: ClientProxy,
    @Inject('PAYMENT_SERVICE')
    private readonly paymentServiceClient: ClientProxy,
  ) {}

  @MessagePattern('entry_exit')
  async handleEntryExitRequest(data: any) {
    return this.entryExitServiceClient.send('entry_exit', data).toPromise();
  }

  @MessagePattern('parking_spot')
  async handleParkingSpotRequest(data: any) {
    return this.parkingSpotServiceClient.send('parking_spot', data).toPromise();
  }

  @MessagePattern('payment')
  async handlePaymentRequest(data: any) {
    return this.paymentServiceClient.send('payment', data).toPromise();
  }
}
