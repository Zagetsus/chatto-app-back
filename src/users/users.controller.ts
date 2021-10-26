import { Response, Request, Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async index(@Request() request, @Response() response) {
    const users = this.usersService.getUsers();
    response.status(200).json(users);
  }

  @Post()
  async store(@Request() request, @Response() response, @Body() body) {
    const emailExist = this.usersService.findByEmail(body.email);
    const usernameExist = this.usersService.findByUsername(body.username);

    if (emailExist) {
      return response.status(400).json({ error: 'Email already exists.' });
    }

    if (usernameExist) {
      return response.status(400).json({ error: 'Username already exists.' });
    }

    const createdUser: any = await this.usersService.create(body);
    return response.status(201).json(createdUser);
  }
}
