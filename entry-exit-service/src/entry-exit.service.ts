import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { VehicleDTO } from './dtos/entry-exit.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class EntryExitService {
  constructor(
    @InjectQueue('entry-exit-queue') private entryExitQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async registerEntry(vehicleInfo: VehicleDTO) {
    // Lógica para registrar a entrada do veículo
    await this.entryExitQueue.add('vehicleEntry', vehicleInfo);
    return this.prisma.vehicle.create({
      data: {
        licensePlate: vehicleInfo.licensePlate,
        model: vehicleInfo.model || 'Unknown',
        color: vehicleInfo.color || 'Unknown',
      },
    });
  }

  async registerExit(vehicleInfo: VehicleDTO) {
    // Lógica para registrar a saída do veículo
    await this.entryExitQueue.add('vehicleExit', vehicleInfo);
    return this.prisma.vehicle.update({
      where: { licensePlate: vehicleInfo.licensePlate },
      data: { exitTime: new Date() },
    });
  }
}
