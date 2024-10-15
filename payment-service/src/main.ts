import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PaymentModule } from './payment.module';
async function bootstrap() {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      PaymentModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'payment-queue',
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
    );

    await app.listen();
    console.log('Payment service is listening');
  } catch (error) {
    console.error('Error starting Payment service:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap Payment service:', error);
  process.exit(1);
});
