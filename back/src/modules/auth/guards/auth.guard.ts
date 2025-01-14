import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../enums/account';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid authorization header');
        }

        const token = authHeader.split(' ')[1];
        try {
            const secret = process.env.JWT_SECRET;
            const user = this.jwtService.verify(token, { secret });

            request.user = {
                ...user,
                roles: user.role || [Role.USER],
            };

            if (requiredRoles && !requiredRoles.some((role) => request.user.role.includes(role))) {
                throw new UnauthorizedException('Access denied');
            }

            return true;
        } catch (error) {
            throw new UnauthorizedException('Not authorized');
        }
    }
}
