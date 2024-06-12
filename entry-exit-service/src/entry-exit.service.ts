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
    // Adiciona a tarefa de entrada à fila
    await this.entryExitQueue.add('vehicleEntry', vehicleInfo);
    // Retorna o registro do veículo (opcional)
    return this.prisma.vehicle.create({ data: vehicleInfo });
  }

  async registerExit(vehicleInfo: VehicleDTO) {
    // Adiciona a tarefa de saída à fila
    await this.entryExitQueue.add('vehicleExit', vehicleInfo);
    // Retorna o registro de atualização do veículo (opcional)
    return this.prisma.vehicle.update({
      where: { licensePlate: vehicleInfo.licensePlate },
      data: { exitTime: new Date() },
    });
  }
}
