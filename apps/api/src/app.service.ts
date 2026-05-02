import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      transport: 'rest',
      timestamp: new Date().toISOString(),
    };
  }
}
