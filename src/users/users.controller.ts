import { Response, Request, Controller, Get, Post, Body, Param } from "@nestjs/common";
import { UsersService } from './users.service';
import { UserValidate } from './user.validation';
import { validation } from '../validation/validation';
import { Public } from 'src/utils/constants';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async index(@Request() request, @Response() response) {
    const users = this.usersService.getUsers();
    response.status(200).json(users);
  }

  @Get(':username')
  async show(@Request() request, @Response() response, @Param() params) {
    const users = await this.usersService.findByUsername(params.username);

    if(!users){
      response.status(400).json({ message: 'Esse usuário não existe' });
    }

    response.status(200).json({
      name: users.name,
      username: users.username,
      email: users.email,
      phone: users.phone,
      img_url: users.img_url,
      status: users.status,
      created_at: users.created_at,
    });
  }

  @Public()
  @Post()
  async store(@Request() request, @Response() response, @Body() body) {
    const emailExist = await this.usersService.findByEmail(body.email);
    const usernameExist = await this.usersService.findByUsername(body.username);
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
