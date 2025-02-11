import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('Incoming request headers:', req.headers);
    console.log('Incoming request body:', req.body);
    console.log('Incoming request files:', req.files);
    next();
  }
}
