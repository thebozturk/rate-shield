import { Controller, Get, Req, Res } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import { Request, Response } from 'express';

@Controller('rate-limiter')
export class RateLimiterController {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  @Get()
  async checkLimit(@Req() req: Request, @Res() res: Response) {
    const key = req.ip; // example key
    const limitExceeded = await this.rateLimiterService.isLimitExceeded(
      key,
      100,
    ); // example limit

    if (limitExceeded) {
      return res.status(429).json({ message: 'Rate limit exceeded' });
    }

    return res.status(200).json({ message: 'Within limit' });
  }
}
