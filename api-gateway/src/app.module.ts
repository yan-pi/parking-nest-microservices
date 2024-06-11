import { Module } from '@nestjs/common';
import { EntryExitModule } from './entry-exit/entry-exit.module';
import { ParkingSpotModule } from './parking-spot/parking-spot.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [EntryExitModule, ParkingSpotModule, PaymentModule],
})
export class AppModule {}
