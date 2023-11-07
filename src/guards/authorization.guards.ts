import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>(
      'AllowedRoles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const result = request.CurrentUser?.Roles.map((roles: string) =>
      allowedRoles.includes(roles),
    ).find((value: boolean) => value === true);
    if (result) return true;
    throw new UnauthorizedException('You dont have access');
  }
}
