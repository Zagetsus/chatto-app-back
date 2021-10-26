import { Injectable } from '@nestjs/common';
import { UserValidate } from './user.validation';
import { validation } from '../validation/validation';

interface IUsers {
  name: string;
  email: string;
  username: string;
  password: string;
}

interface ErrorInterface {
  property: string;
  description: any;
}

interface ValidationInterface {
  status: boolean;
  errors?: ErrorInterface[];
}

@Injectable()
export class UsersService {
  private users: IUsers[] = [];

  async create(data: IUsers): Promise<ValidationInterface | IUsers> {
    const userValidate = new UserValidate();

    userValidate.name = data.name;
    userValidate.email = data.email;
    userValidate.username = data.username;
    userValidate.password = data.password;

    const validated = await validation(userValidate);

    if (!validated.status) {
      return validated;
    }

    this.users.push(data);

    delete data.password;
    return data;
  }

  getUsers() {
    return this.users;
  }

  findByEmail(email) {
    return this.users.find((element) => element.email === email);
  }

  findByUsername(username) {
    return this.users.find((element) => element.username === username);
  }
}
