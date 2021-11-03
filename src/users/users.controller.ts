import { Response, Request, Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserValidate } from './user.validation';
import { validation } from '../validation/validation';

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
    const errors = [];

    const userValidate = new UserValidate();

    userValidate.name = body.name;
    userValidate.email = body.email;
    userValidate.username = body.username;
    userValidate.password = body.password;

    const validated = await validation(userValidate);

    if (!validated.status) {
      errors.push(...validated.errors);
    }

    if (emailExist) {
      errors.push({ property: 'email', description: 'E-mail já cadastrado!' });
    }

    if (usernameExist) {
      errors.push({
        property: 'username',
        description: 'Nome de usuário não disponível!',
      });
    }

    if (errors.length > 0) {
      return response.status(400).json({ errors });
    }

    const createdUser: any = await this.usersService.create(body);

    return response.status(201).json(createdUser);
  }
}
