import { Injectable } from '@nestjs/common';
import { CreateEntryExitDto } from './dtos/entry-exit.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EntryExitService {
  constructor(private readonly httpService: HttpService) {}

  async createEntry(createEntryExitDto: CreateEntryExitDto) {
    const entryExitResponse = await this.httpService
      .post('http://entry-exit-service/entry', createEntryExitDto)
      .toPromise();
    return entryExitResponse.data;
  }

  async createExit(createEntryExitDto: CreateEntryExitDto) {
    const entryExitResponse = await this.httpService
      .post('http://entry-exit-service/exit', createEntryExitDto)
      .toPromise();
    return entryExitResponse.data;
  }
}
