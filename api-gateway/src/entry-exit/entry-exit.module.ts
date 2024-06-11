import { Module } from '@nestjs/common';
import { EntryExitController } from './entry-exit.controller';
import { EntryExitService } from './entry-exit.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [EntryExitController],
  providers: [EntryExitService],
})
export class EntryExitModule {}
