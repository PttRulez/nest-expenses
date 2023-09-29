import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserSession } from '../types';
import { Reflector } from '@nestjs/core';

export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublicRoute = this.reflector.getAllAndOverride<string>(
      'PUBLIC_ROUTE',
      [context.getHandler(), context.getClass()],
    );
    if (isPublicRoute) return true;

    const request = context.switchToHttp().getRequest() as Request;
    const session = request.session as UserSession;

    if (!session.user) throw new UnauthorizedException('Session not provided');
    return true;
  }
}
