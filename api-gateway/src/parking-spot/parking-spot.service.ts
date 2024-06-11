import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ParkingSpotService {
  constructor(private readonly httpService: HttpService) {}

  async checkAvailability() {
    const response = await firstValueFrom(
      this.httpService.get('http://parking-spot-service/availability'),
    );
    return response.data;
  }

  async reserveSpot(id: string) {
    const response = await firstValueFrom(
      this.httpService.post(`http://parking-spot-service/reserve/${id}`),
    );
    return response.data;
  }
}
