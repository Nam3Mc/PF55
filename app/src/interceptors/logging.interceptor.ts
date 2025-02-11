import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log(`Método: ${request.method} | URL: ${request.url}`); // Log de solicitud

    return next
      .handle()
      .pipe(
        tap(() => {
          console.log(`Método: ${request.method} | URL: ${request.url} completada`); // Log después de la respuesta
        }),
      );
  }
}
