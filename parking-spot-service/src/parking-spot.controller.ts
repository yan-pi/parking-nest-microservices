import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ParkingSpotService } from './parking-spot.service';

@Controller()
export class ParkingSpotController {
  constructor(private readonly parkingSpotService: ParkingSpotService) {}

  @EventPattern('checkAvailability')
  async handleCheckAvailability() {
    return await this.parkingSpotService.checkAvailability();
  }

  @EventPattern('allocateSpot')
  async handleAllocateSpot(vehicleId: number) {
    return await this.parkingSpotService.allocateSpot(vehicleId);
  }
}
