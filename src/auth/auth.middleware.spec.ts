import { AuthMiddleware } from './auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test' }); // Test için basit bir secret kullanabilirsiniz
    authMiddleware = new AuthMiddleware(jwtService);
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
        authorization: 'Bearer invalid-token',
      },
    };
    const res: any = {};
    const next = jest.fn();

    expect(() => authMiddleware.use(req, res, next)).toThrow(
      UnauthorizedException,
    );
  });

  // Daha fazla test senaryosu ekleyebilirsiniz
  // Örneğin, geçerli bir token ile middleware'in başarılı bir şekilde 'next()' fonksiyonunu çağırması gibi

  it('should set the user on the request object if the token is valid', () => {
    const req: any = {
      headers: {
        authorization: `Bearer ${jwtService.sign({ id: 1 })}`,
      },
    };
    const res: any = {};
    const next = jest.fn();

    authMiddleware.use(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user.id).toEqual(1);
  });

  it('should call the next function if the token is valid', () => {
    const req: any = {
      headers: {
        authorization: `Bearer ${jwtService.sign({ id: 1 })}`,
      },
    };
    const res: any = {};
    const next = jest.fn();

    authMiddleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
