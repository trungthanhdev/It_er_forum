
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseStandardInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse()
    return next
      .handle()
      .pipe(
       map(data => ({
          is_success: true,
          status_code: response.statusCode,
          message: "Successfully",
          data: data,
          timestamp: Date.now()  
       }))
      );
  }
}
