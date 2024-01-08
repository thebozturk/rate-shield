import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RateLimiterService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async isLimitExceeded(key: string, limit: number): Promise<boolean> {
    const current = await this.redisClient.incr(key);
    if (current > limit) {
      return true;
    }
    if (current === 1) {
      await this.redisClient.expire(key, 3600); // 1 hour
    }
    return false;
  }
}
