import { Controller, Get, Param } from '@nestjs/common';
import { ParkingSpotService } from './parking-spot.service';

@Controller('parking-spot')
export class ParkingSpotController {
  constructor(private readonly parkingSpotService: ParkingSpotService) {}

  @Get('availability')
  checkAvailability() {
    return this.parkingSpotService.checkAvailability();
  }

  @Get('reserve/:id')
  reserveSpot(@Param('id') id: string) {
    return this.parkingSpotService.reserveSpot(id);
  }
}
