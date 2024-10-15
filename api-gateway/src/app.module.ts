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
          urls: ['amqp://rabbitmq:5672'],
          queue: 'entry-exit-queue',
          queueOptions: {
            durable: false,
          },
          prefetchCount: 1,
          persistent: true,
          noAck: false,
          socketOptions: {
            keepAlive: true,
          },
          retry: {
            retries: 5,
            factor: 2,
            minTimeout: 1000,
            maxTimeout: 5000,
          },
        },
      },
      {
        name: 'PARKING_SPOT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
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
          urls: ['amqp://rabbitmq:5672'],
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
