import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
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
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService],
})
export class AppModule {}
