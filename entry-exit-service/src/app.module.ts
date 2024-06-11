import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EntryExitController } from './entry-exit.controller';
import { EntryExitService } from './entry-exit.service';
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
  controllers: [EntryExitController],
  providers: [EntryExitService, PrismaService],
})
export class AppModule {}
