import { Controller, Get } from '@nestjs/common';
import { ParkingSpotService } from './parking-spot.service';

@Controller('parking-spot')
export class ParkingSpotController {
  constructor(private readonly parkingSpotService: ParkingSpotService) {}

  @Get('availability')
  async getAvailability() {
    return await this.parkingSpotService.checkAvailability();
  }
}
