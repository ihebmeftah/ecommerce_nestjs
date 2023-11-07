import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
    } else {
      const token = authHeader.split(' ')[1];
      const { id } = <JwtPaylod>(
        verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
      );
      const currentUser = await this.userService.findOne(+id);
      req.currentUser = currentUser;
      console.log(currentUser);
    }
    next();
  }
}

interface JwtPaylod {
  id: string;
}
