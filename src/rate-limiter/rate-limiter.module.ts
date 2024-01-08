import { Module } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import { RateLimiterController } from './rate-limiter.controller';

@Module({
  providers: [RateLimiterService],
  controllers: [RateLimiterController]
})
export class RateLimiterModule {}
