import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class FriendsService {
  private friends = [];

  constructor(private usersService: UsersService) {}

  getFriends(id) {
    return this.friends.filter((item) => item.id === id);
  }
}
