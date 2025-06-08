import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler()
    );
    
    if (!requiredRoles) {
      return true; // Если роли не указаны, доступ разрешен
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Пользователь из JWT
    
    return requiredRoles.includes(user.role);
  }
}
