import { Module } from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';
import { RateLimiterInterceptor } from './rate-limiter.interceptor';

@Module({
  providers: [RateLimiterService, RateLimiterInterceptor],
  controllers: [],
  exports: [RateLimiterService, RateLimiterInterceptor],
})
export class RateLimiterModule {}
