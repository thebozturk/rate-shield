import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RateLimiterService } from './rate-limiter.service';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  constructor(
    private readonly rateLimiterService: RateLimiterService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const currentRoute = context.getHandler();
    const endpoint = request.route.path;
    const key = this.getKey(request, currentRoute);
    const duration = 3600;

    const limit = this.getLimit(currentRoute);

    const { exceeded, ttl } = await this.rateLimiterService.checkWeightedLimit(
      endpoint,
      key,
      duration,
      limit,
    );

    if (exceeded) {
      const retryAfterMinute = Math.ceil(ttl / 60);
      throw new HttpException(
        {
          message: 'Rate limit exceeded',
          error: HttpStatus.TOO_MANY_REQUESTS,
          Try_Again_After: `${retryAfterMinute} minutes`,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return next.handle();
  }

  private getKey(request, currentRoute): string {
    // if isPublicRoute return request.ip because public route is not authenticated
    if (this.isPublicRoute(currentRoute)) {
      return `ip: ${request.ip}`;
    }

    // if isPrivateRoute return request.headers.authorization because private route is authenticated
    return `token:${request.headers.authorization}`;
  }

  private isPublicRoute(currentRoute): boolean {
    return this.reflector.get(IS_PUBLIC_KEY, currentRoute);
  }

  private getLimit(currentRoute): number {
    // different limits for public and private routes
    if (this.isPublicRoute(currentRoute)) {
      return parseInt(process.env.PUBLIC_ROUTE_LIMIT, 10) || 100; // default 100
    }
    // different limits for public and private routes
    return parseInt(process.env.PRIVATE_ROUTE_LIMIT, 10) || 200; // default 200
  }
}
