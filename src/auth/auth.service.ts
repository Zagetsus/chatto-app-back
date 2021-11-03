import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';

interface IUsers {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  friends_id?: string[];
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<IUsers> {
    const user = this.usersService.findByUsername(username);

    function throwError() {
      throw new BadRequestException({
        status: false,
        type: 'toast',
        message: 'Usuário e/ou senha incorretos',
      });
    }

    if (!user) {
      throwError();
    }

    const passMatched = await compare(password, user.password);

    if (!passMatched) {
      throwError();
    }

    return user;
  }
}
