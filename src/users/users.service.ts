import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';

interface IUsers {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  friends_ids: string[];
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
    data.password = await hash(data.password, 8);
    data.id = uuidv4();

    this.users.push(data);

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

  setFriends(username, id) {
    const user = this.findByUsername(username);

    if (!user) {
      throw new BadRequestException({
        status: false,
        errors: [
          {
            property: 'id',
            description: 'Usuário não encontrado!',
          },
        ],
      });
    }

    this.users.map((item) => {
      item.friends_ids.map((friend) => {
        if (friend === user.id) {
          throw new BadRequestException({
            status: false,
            errors: [
              {
                property: 'id',
                description: 'Você já tem essa pessoa adicionada!',
              },
            ],
          });
        }
      });

      if (item.id == id) {
        item.friends_ids.push(user.id);
      }
    });
  }
}
