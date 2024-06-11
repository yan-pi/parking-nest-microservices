import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EntryExitService } from './entry-exit.service';
import {
  CreateEntryExitSchema,
  CreateEntryExitDto,
} from './dtos/entry-exit.dto';

@Controller('entry-exit')
export class EntryExitController {
  constructor(private readonly entryExitService: EntryExitService) {}

  @Post('entry')
  async createEntry(@Body() body: any) {
    try {
      const createEntryExitDto: CreateEntryExitDto =
        CreateEntryExitSchema.parse(body);
      return await this.entryExitService.createEntry(createEntryExitDto);
    } catch (error) {
      throw new BadRequestException(error.errors);
    }
  }

  @Post('exit')
  async createExit(@Body() body: any) {
    try {
      const createEntryExitDto: CreateEntryExitDto =
        CreateEntryExitSchema.parse(body);
      return await this.entryExitService.createExit(createEntryExitDto);
    } catch (error) {
      throw new BadRequestException(error.errors);
    }
  }
}
