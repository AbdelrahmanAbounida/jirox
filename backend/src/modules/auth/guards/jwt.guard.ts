import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.guard';
import { Roles } from './roles.guard';
import { Request } from 'express';
import { USER_ROLE_ENUM } from 'src/modules/users/enums/role.enum';

@Injectable()
export class JWTAuthGuard extends AuthGuard(['myjwt']) {
  // u can add here a chain of strategies

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // check if this is a puublic route
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // handle authorization

    // in case user might override the decorator of controller to specific route

    // const reqRole = this.reflector.getAllAndOverride(Roles, [context.getHandler(), context.getClass()]);

    // OR
    // const reqRole = this.reflector.getAllAndMerge<string[]>('roles', context.getHandler());

    // this gonna read it from the handler/route >> and if u didn't define it it will read from the controller
    const reqRole = this.reflector.get(Roles, context.getHandler()); //
    const request = context.switchToHttp().getRequest();
    const user = request?.user;

    if (
      reqRole === USER_ROLE_ENUM.ADMIN &&
      user?.role === USER_ROLE_ENUM.USER
    ) {
      // return false;
      throw new UnauthorizedException(
        'You are not authorized to access this route',
      );
    }

    // TODO:: check if request headers contain apikey and then validate it

    // handle authentication
    // if (context.getArgs) return super.canActivate(context);
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        'Token not found. Please Login or add Login to your request header',
      );
    }

    // How to extract user from token
    // check token validation
    return super.canActivate(context); // This will call the validate method of the strategy
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
