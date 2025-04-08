
import { date } from '@hapi/joi';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse()

    const resMessage = typeof exception.getResponse() === "string"
                            ? message
                              : (message as any).message || null

    response
      .status(status)
      .json({
        statusCode: status,
        is_success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: resMessage
      });
  }
}
