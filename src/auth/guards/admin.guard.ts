import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserSession } from '../types';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isAdminRoute = this.reflector.getAllAndOverride<string>(
      'ONLY_ADMIN',
      [context.getHandler(), context.getClass()],
    );
    if (!isAdminRoute) return true;

    const request = context.switchToHttp().getRequest() as Request;
    const session = request.session as UserSession;

    if (session.user.role !== Role.ADMIN)
      throw new UnauthorizedException('Reserved for admins');
    return true;
  }
}
