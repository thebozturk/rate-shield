import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RateLimiterService {
  private redisClient: Redis;
  constructor() {
    this.redisClient = new Redis({
      password: process.env.REDIS_PASSWORD,
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
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
  ): Promise<{ exceeded: boolean; ttl: number }> {
    const current = await this.redisClient.incr(key);
    if (current >= limit) {
      const ttl = await this.redisClient.ttl(key);
      return { exceeded: true, ttl: ttl };
    }
    if (current === 1) {
      await this.redisClient.expire(key, duration);
    }
    return { exceeded: false, ttl: 0 };
  }

  async checkWeightedLimit(
    endpoint: string,
    key: string,
    duration: number,
    limit: number,
  ): Promise<{ exceeded: boolean; ttl: number }> {
    const weights = { '/endpoint1': 1, '/endpoint2': 2, '/endpoint3': 5 };
    const newLimit = limit * weights[endpoint];

    if (!weights[endpoint]) {
      return this.isLimitExceeded(key, limit, duration);
    }
    return this.isLimitExceeded(key, newLimit, duration);
  }
}
