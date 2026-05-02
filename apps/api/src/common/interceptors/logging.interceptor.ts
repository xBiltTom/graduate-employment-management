import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const start = Date.now();

    const method = request.method;
    const url = request.originalUrl || request.url;
    const userAgent = request.headers['user-agent'] ?? 'unknown';
    const ip = request.ip ?? request.socket.remoteAddress ?? 'unknown';

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(
          `${method} ${url} ${response.statusCode} - ${duration}ms - ${ip} - ${userAgent}`,
        );
      }),
      catchError((error: unknown) => {
        const duration = Date.now() - start;
        const statusCode =
          typeof response.statusCode === 'number' && response.statusCode > 0
            ? response.statusCode
            : 500;

        this.logger.warn(
          `${method} ${url} ${statusCode} - ${duration}ms - ${ip} - ${userAgent}`,
        );

        return throwError(() => error);
      }),
    );
  }
}
