import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

interface IUsers {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  friends_ids: string[];
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {}

  async create(data: IUsers): Promise<User> {
    data.password = await hash(data.password, 8);

    const createdUser = new this.userModel(data);
    const saveUser = await createdUser.save();

    delete saveUser.password;
    return saveUser;
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async findByUsername(username): Promise<User> {
    return await this.userModel.findOne({ username: username }).exec();
  }
}
