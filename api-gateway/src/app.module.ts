import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ENTRY_EXIT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'], // Alterado para 'rabbitmq' em vez de 'localhost'
          queue: 'entry-exit-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'PARKING_SPOT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'], // Alterado para 'rabbitmq' em vez de 'localhost'
          queue: 'parking-spot-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'], // Alterado para 'rabbitmq' em vez de 'localhost'
          queue: 'payment-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [GatewayController],
})
export class AppModule {}
