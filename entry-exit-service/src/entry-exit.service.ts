import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VehicleDTO } from './dtos/entry-exit.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class EntryExitService {
  constructor(
    @Inject('ENTRY_EXIT_SERVICE') private client: ClientProxy,
    private prisma: PrismaService,
  ) {}

  async registerEntry(vehicleInfo: VehicleDTO) {
    // Lógica para registrar a entrada do veículo
    await this.client.emit('vehicleEntry', vehicleInfo);
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
    await this.client.emit('vehicleExit', vehicleInfo);
    return this.prisma.vehicle.update({
      where: { licensePlate: vehicleInfo.licensePlate },
      data: { exitTime: new Date() },
    });
  }
}
