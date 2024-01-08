import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const expectedToken = process.env.AUTH_TOKEN;
    if (token !== expectedToken) {
      throw new UnauthorizedException('Invalid token');
    }
    next();
  }
}
