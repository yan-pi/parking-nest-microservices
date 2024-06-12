import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ParkingSpotService {
  constructor(
    @Inject('PARKING_SPOT_SERVICE')
    private readonly parkingSpotService: ClientProxy,
    private prisma: PrismaService,
  ) {}

  async checkAvailability() {
    return this.prisma.parkingSpot.findMany({ where: { isOccupied: false } });
  }

  async allocateSpot(vehicleId: number) {
    try {
      const spot = await this.prisma.parkingSpot.findFirst({
        where: { isOccupied: false },
      });

      if (!spot) {
        return null;
      }

      const updateSpot = await this.prisma.parkingSpot.update({
        where: { id: spot.id },
        data: { isOccupied: true, vehicleId: vehicleId },
      });

      await this.parkingSpotService
        .emit('spotAllocated', updateSpot)
        .toPromise();
      return updateSpot;
    } catch (error) {
      console.log('Error allocating spot', error);
      throw error;
    }
  }
}
