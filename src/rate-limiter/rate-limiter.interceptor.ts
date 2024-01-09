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
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
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
    const endpoint = request.route.path;
    const key = this.getKey(request);
    const duration = 3600;

    const limit = this.getLimit(request);
    let isExceeded = false;

    if (this.isPublicRoute(request)) {
      isExceeded = await this.rateLimiterService.isLimitExceeded(
        key,
        limit,
        duration,
      );
    } else {
      isExceeded = await this.rateLimiterService.checkWeightedLimit(
        endpoint,
        key,
        duration,
      );
    }

    if (isExceeded) {
      throw new HttpException(
        'Rate limit exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return next.handle();
  }

  private getKey(request): string {
    // if isPublicRoute return request.ip because public route is not authenticated
    if (this.isPublicRoute(request)) {
      return `ip:${request.ip}`;
    }

    // if isPrivateRoute return request.headers.authorization because private route is authenticated
    return `token:${request.headers.authorization}`;
  }

  private isPublicRoute(request: Request): boolean {
    const context = request[ROUTE_ARGS_METADATA];
    if (!context) {
      return false;
    }
    return this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
  }

  private getLimit(request): number {
    // different limits for public and private routes
    if (this.isPublicRoute(request)) {
      return parseInt(process.env.PUBLIC_ROUTE_LIMIT, 10) || 100; // default 100
    }
    // different limits for public and private routes
    return parseInt(process.env.PRIVATE_ROUTE_LIMIT, 10) || 200; // default 200
  }
}
