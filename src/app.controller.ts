import { Body, Controller, Get, Post, Request, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/login')
  async login(@Request() request, @Response() response, @Body() body) {
    await this.authService.validateUser(body.username, body.password);

    response.status(200).json('Usuário logado com sucesso!');
  }
}
