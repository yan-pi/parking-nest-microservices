import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ParkingSpotController } from './parking-spot.controller';
import { ParkingSpotService } from './parking-spot.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'rabbitmq-service',
        port: 5672,
      },
    }),
    BullModule.registerQueue({
      name: 'entry-exit-queue',
    }),
  ],
  controllers: [ParkingSpotController],
  providers: [ParkingSpotService, PrismaService],
})
export class AppModule {}
