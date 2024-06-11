import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EntryExitService } from './entry-exit.service';
import { VehicleSchema, VehicleDTO } from './dtos/entry-exit.dto';

@Controller('entry-exit')
export class EntryExitController {
  constructor(private readonly entryExitService: EntryExitService) {}

  @Post('entry')
  async registerEntry(@Body() vehicleInfo: VehicleDTO) {
    try {
      VehicleSchema.parse(vehicleInfo);
      return await this.entryExitService.registerEntry(vehicleInfo);
    } catch (error) {
      throw new BadRequestException(error.errors);
    }
  }

  @Post('exit')
  async registerExit(@Body() vehicleInfo: VehicleDTO) {
    try {
      VehicleSchema.parse(vehicleInfo);
      return await this.entryExitService.registerExit(vehicleInfo);
    } catch (error) {
      throw new BadRequestException(error.errors);
    }
  }
}
