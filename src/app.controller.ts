import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
   @Get('keep-awake')
  keepAwake() {
    console.log('Keep awake ping received at', new Date().toISOString());
    return { message: 'I am awake!' };
  }
}
