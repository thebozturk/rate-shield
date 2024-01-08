import { AuthMiddleware } from './auth.middleware';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
      ],
      providers: [AuthMiddleware],
    }).compile();
    authMiddleware = moduleRef.get<AuthMiddleware>(AuthMiddleware);
  });

  it('should be defined', () => {
    expect(authMiddleware).toBeDefined();
  });

  it('should throw an error if no authorization header is present', () => {
    const req: any = {
      headers: {},
    };
    const res: any = {};
    const next = jest.fn();

    expect(() => authMiddleware.use(req, res, next)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw an error if the token is invalid', () => {
    const req: any = {
      headers: {
        authorization: 'InvalidToken',
      },
    };
    const res: any = {};
    const next = jest.fn();

    expect(() => authMiddleware.use(req, res, next)).toThrow(
      UnauthorizedException,
    );
  });

  it('should call next if the token is valid', () => {
    const req: any = {
      headers: {
        authorization: process.env.AUTH_TOKEN,
      },
    };
    const res: any = {};
    const next = jest.fn();

    authMiddleware.use(req, res, next);
    expect(next).toBeCalled();
  });
});
