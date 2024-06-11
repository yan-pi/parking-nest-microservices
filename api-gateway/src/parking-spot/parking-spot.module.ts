import { Module } from '@nestjs/common';
import { ParkingSpotController } from './parking-spot.controller';
import { ParkingSpotService } from './parking-spot.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ParkingSpotController],
  providers: [ParkingSpotService],
})
export class ParkingSpotModule {}
