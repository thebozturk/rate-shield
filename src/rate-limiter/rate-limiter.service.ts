import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RateLimiterService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    })
      .on('error', (error) => {
        console.error(error);
      })
      .on('connect', () => {
        console.log('Connected to Redis');
      });
  }

  async isLimitExceeded(
    key: string,
    limit: number,
    duration: number,
  ): Promise<boolean> {
    const current = await this.redisClient.incr(key);
    if (current > limit) {
      return true;
    }
    if (current === 1) {
      await this.redisClient.expire(key, duration);
    }
    return false;
  }

  async checkWeightedLimit(
    endpoint: string,
    key: string,
    duration: number,
  ): Promise<boolean> {
    const weights = { '/endpoint1': 1, '/endpoint2': 2, '/endpoint3': 5 };
    const limit =
      parseInt(process.env.TOKEN_RATE_LIMIT, 10) / weights[endpoint];

    return this.isLimitExceeded(key, limit, duration);
  }
}
