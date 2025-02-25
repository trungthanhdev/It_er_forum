
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private roles: string[]){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log("2");
    // console.log(request.currentUser.role);
    // console.log(this.roles.includes(request.currentUser.role));

    return this.roles.includes(request.currentUser.role)
  }
}
