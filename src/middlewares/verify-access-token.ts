import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { UserAccessPayload } from 'src/user/user.types';

@Injectable()
export class VerifyAccessToken implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const token = this.extractToken(req);
    const errorMessage = 'You do not have access to this endpoint';

    if (!token) {
      throw new UnauthorizedException(errorMessage);
    }

    try {
      const user: UserAccessPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });
      req['user'] = user;
      next();
    } catch (error: any) {
      throw new UnauthorizedException(errorMessage);
    }
  }

  private extractToken(req: Request): string {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    return token;
  }
}
