import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ROLE_ADMIN_CODE } from 'src/shared/constant';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private roles: string[], private jwtService: JwtService = null) {
    this.jwtService = new JwtService(null);
  }

  /**
   * Returns true if the user, who has made the request, has one of the roles which have the permission to make a request
   * @param context Excution context
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Use the access token to understand if the user is an admin
    const authorization: string = context.switchToWs().getData().req.headers.authorization;
    const accessToken = authorization.replace('Bearer ', '');

    if (accessToken) {
      const payload = this.jwtService.decode(accessToken) as any;
      const roles = payload.roles;
      if (roles) {
        for (let i = 0; i < roles.length; i += 1) {
          const roleCode = roles[i].code;
          if (roleCode === ROLE_ADMIN_CODE || this.roles.includes(roleCode)) {
            return true;
          }
        } // for
      } // if
    } // if
    return false;
  } // canActivate
} // RoleGuard
