import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { EntryExitService } from './entry-exit.service';
import { VehicleDTO } from './dtos/entry-exit.dto';

@Controller()
export class EntryExitController {
  constructor(private readonly entryExitService: EntryExitService) {}

  @EventPattern('vehicleEntry')
  async handleVehicleEntry(data: VehicleDTO) {
    await this.entryExitService.registerEntry(data);
  }

  @EventPattern('vehicleExit')
  async handleVehicleExit(data: VehicleDTO) {
    await this.entryExitService.registerExit(data);
  }
}
