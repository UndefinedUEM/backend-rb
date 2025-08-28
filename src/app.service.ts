import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '👾 API online. Sistemas operacionais: 100%. Que a força esteja com você!';
  }
}
