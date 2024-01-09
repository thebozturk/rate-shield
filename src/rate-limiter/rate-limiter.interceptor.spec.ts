import { RateLimiterInterceptor } from './rate-limiter.interceptor';
import { ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { RateLimiterService } from './rate-limiter.service';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

describe('RateLimiterInterceptor', () => {
  let interceptor: RateLimiterInterceptor;
  let rateLimiterService: RateLimiterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimiterInterceptor,
        {
          provide: RateLimiterService,
          useValue: {
            isLimitExceeded: jest.fn(),
            checkWeightedLimit: jest.fn(),
          },
        },
        Reflector,
      ],
    }).compile();

    interceptor = module.get<RateLimiterInterceptor>(RateLimiterInterceptor);
    rateLimiterService = module.get<RateLimiterService>(RateLimiterService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  /*it('should throw HttpException if rate limit exceeded', async () => {
    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          route: { path: '/test' },
          ip: '127.0.0.1',
          headers: { authorization: 'Bearer token' },
        }),
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;

    const next = {
      handle: () => of({}),
    };

    try {
      await interceptor.intercept(executionContext, next);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.response).toBe('Rate limit exceeded');
      expect(err.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
      return;
    }

    // Eğer hata fırlatılmazsa, test başarısız olmalıdır.
    fail('Expected HttpException was not thrown');
  });*/

  it('should call next handler if rate limit not exceeded', async () => {
    jest.spyOn(rateLimiterService, 'isLimitExceeded').mockResolvedValue(false);

    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          route: { path: '/test' },
          ip: '127.0.0.1',
          headers: { authorization: 'Bearer token' },
        }),
        getResponse: () => ({}),
      }),
    } as unknown as ExecutionContext;

    const next = {
      handle: jest.fn(() => of({})),
    };

    await interceptor.intercept(executionContext, next);
    expect(next.handle).toHaveBeenCalled();
  });
});
