import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  httpService: any;
  getHello(): string {
    return 'Hello World!';
  }
  @Cron('*/14 * * * *') 
  async pingSelf() {
    const url = 'https://it-er-forum.onrender.com/keep-awake'; 
    try {
      // await firstValueFrom(this.httpService.get(url));
      console.log(' Ping self to stay awake');
    } catch (error) {
      console.error(' Error ping self:', error.message);
    }
  }
}
