import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { messageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('messages')
export class MessagesController {
  constructor(
    @InjectModel('Message')
    private messageModel: Model<messageDocument>,
    private usersService: UsersService,
  ) {}

  @Get()
  async index(@Request() request, @Response() response) {
    return response.status(200);
  }

  @Get(':username')
  async show(@Request() request, @Response() response, @Param() params) {
    const { username } = params;
    const { userId } = request.user;

    if (!username) {
      return response
        .status(400)
        .json({ message: 'Nenhum username foi passado' });
    }

    const friend: UserDocument & any = await this.usersService.findByUsername(
      username,
    );

    const messages: messageDocument & any = await this.messageModel.find({
      $and: [
        {
          $or: [{ from_id: userId }, { from_id: friend._id }],
        },
        {
          $or: [{ to_id: friend._id }, { to_id: userId }],
        },
      ],
    });

    const newMessages: any = [];

    messages.map((item) => {
      const date = new Date(item.created_at);
      newMessages.push({
        body: item.body,
        owner: item.from_id.toString() === userId,
        hours: `${date.getHours()}:${date.getMinutes()}`,
      });
    });

    const data = {
      id: friend._id,
      name: friend.name,
      status: friend.status,
      messages: newMessages,
    };

    return response.status(200).json(data);
  }

  @Post()
  async store(@Request() request, @Response() response, @Body() body) {
    const { userId } = request.user;

    const data = {
      from_id: userId,
      view: false,
      ...body,
    };

    const createdChat = await this.messageModel.create(data);
    const savedChat = await createdChat.save();

    return response.status(201).json(savedChat);
  }
}
