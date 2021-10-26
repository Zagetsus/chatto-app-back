import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <h1 style='color: #00A7B1; font-family: Arial, sans-serif; font-size: 42px; font-weight: 400; '>
        Chatto started
      </h1>
   `;
  }
}
