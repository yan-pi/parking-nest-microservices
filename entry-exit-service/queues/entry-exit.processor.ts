// entry-exit.processor.ts

import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../prisma.service';
import { VehicleDTO } from '../entry-exit/dtos/entry-exit.dto';

@Processor('entry-exit-queue')
export class EntryExitProcessor {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(EntryExitProcessor.name);

  @Process('vehicleEntry')
  async handleVehicleEntry(job: Job<VehicleDTO>) {
    const vehicleInfo = job.data;
    this.logger.debug(
      `Processing vehicle entry for ${vehicleInfo.licensePlate}`,
    );
    // Lógica para registrar a entrada do veículo
    await this.prisma.vehicle.create({ data: vehicleInfo });
  }

  @Process('vehicleExit')
  async handleVehicleExit(job: Job<VehicleDTO>) {
    const vehicleInfo = job.data;
    this.logger.debug(
      `Processing vehicle exit for ${vehicleInfo.licensePlate}`,
    );
    // Lógica para registrar a saída do veículo
    await this.prisma.vehicle.update({
      where: { licensePlate: vehicleInfo.licensePlate },
      data: { exitTime: new Date() },
    });
  }
}
