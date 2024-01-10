import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';
import { Private } from './common/decorators/private.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/private')
  @Private()
  getPrivateHello(): string {
    return this.appService.getHello();
  }

  @Get('/endpoint1')
  @Public()
  getEndpoint1(): string {
    return this.appService.getHello();
  }

  @Get('/endpoint2')
  @Public()
  getEndpoint2(): string {
    return this.appService.getHello();
  }

  @Get('/endpoint3')
  @Public()
  getEndpoint3(): string {
    return this.appService.getHello();
  }
}
