import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'ENTRY_EXIT_SERVICE', transport: Transport.RMQ },
      { name: 'PARKING_SPOT_SERVICE', transport: Transport.RMQ },
      { name: 'PAYMENT_SERVICE', transport: Transport.RMQ },
    ]),
  ],
  controllers: [GatewayController],
})
export class AppModule {}
