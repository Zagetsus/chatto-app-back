import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { User } from '../users/schemas/user.schema';

type IUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<IUser> {
    const user = await this.usersService.findByUsername(username);

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

    const passMatched = await compare(pass, user.password);

    if (!passMatched) {
      throwError();
    }

    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };

    const returnUser = await this.usersService.findByUsername(user.username);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        name: returnUser.name,
        email: returnUser.email,
        username: returnUser.username,
        image: returnUser.img_url,
      },
    };
  }
}
