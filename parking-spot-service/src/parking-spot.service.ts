import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from './prisma.service';
import { VehicleDTO } from './dtos/parking-spot.dto';

@Injectable()
export class ParkingSpotService implements OnModuleInit {
  constructor(
    @InjectQueue('entry-exit-queue') private entryExitQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    this.entryExitQueue.process('vehicleEntry', async (job) => {
      const vehicleInfo: VehicleDTO = job.data;
      // Lógica para verificar disponibilidade de vagas e alocar
      const availableSpot = await this.prisma.parkingSpot.findFirst({
        where: { isOccupied: false },
      });
      if (availableSpot) {
        await this.prisma.parkingSpot.update({
          where: { id: availableSpot.id },
          data: { isOccupied: true },
        });
      }
    });

    this.entryExitQueue.process('vehicleExit', async (job) => {
      const vehicleInfo: VehicleDTO = job.data;
      // Lógica para liberar a vaga
      const occupiedSpot = await this.prisma.parkingSpot.findFirst({
        where: { isOccupied: true, vehicleId: vehicleInfo.id },
      });
      if (occupiedSpot) {
        await this.prisma.parkingSpot.update({
          where: { id: occupiedSpot.id },
          data: { isOccupied: false, vehicleId: null },
        });
      }
    });
  }

  async checkAvailability() {
    return await this.prisma.parkingSpot.findMany({
      where: { isOccupied: false },
    });
  }
}
