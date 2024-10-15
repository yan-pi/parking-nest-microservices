import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ParkingSpotModule } from './parking-spot.module';
async function bootstrap() {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      ParkingSpotModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'parking-spot-queue',
          queueOptions: {
            durable: false,
          },
          prefetchCount: 1,
          noAck: false,
          persistent: true,
          heartbeat: 60,
        },
      },
    );

    await app.listen();
    console.log('Parking Spot service is listening');
  } catch (error) {
    console.error('Failed to start Parking Spot service', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Unhandled error in bootstrap', error);
  process.exit(1);
});
