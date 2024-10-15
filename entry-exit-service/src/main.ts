import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { EntryExitModule } from './entry-exit.module';
async function bootstrap() {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      EntryExitModule,
      {
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
    );

    await app.listen();
    console.log('Entry-Exit service is listening');
  } catch (error) {
    console.error('Failed to start Entry-Exit service', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Unhandled error in Entry-Exit service', error);
  process.exit(1);
});
