import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ParkingSpotService {
  constructor(private prisma: PrismaService) {}

  async checkAvailability() {
    return this.prisma.parkingSpot.findMany({ where: { isOccupied: false } });
  }

  async allocateSpot(vehicleId: number) {
    const spot = await this.prisma.parkingSpot.findFirst({
      where: { isOccupied: false },
    });
    if (spot) {
      await this.prisma.parkingSpot.update({
        where: { id: spot.id },
        data: { isOccupied: true, vehicleId: vehicleId },
      });
      return spot;
    }
    return null;
  }
}
