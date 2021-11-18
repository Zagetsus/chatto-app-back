import { Body, Controller, Get, Post, Request, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';

@Controller('friends')
export class FriendsController {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {}

  @Get()
  async index(@Request() request, @Response() response) {
    const friends = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'friends_ids',
          foreignField: '_id',
          as: 'friend',
        },
      },
      {
        $match: { username: 'wolf' },
      },
      {
        $unwind: '$friend',
      },
      {
        $project: {
          _id: 0,
          name: '$friend.name',
          email: '$friend.email',
          img: '$friend.img_url',
        },
      },
    ]);

    return response.status(201).json(friends);
  }

  @Post()
  async store(@Request() request, @Response() response, @Body() body) {
    const { userId } = request.user;

    const { friendUsername } = body;

    const loggedUser = await this.userModel.findById(userId);
    const targetUser = await this.userModel.findOne({
      username: friendUsername,
    });

    if (!targetUser) {
      return response.status(400).json({
        errors: [
          {
            property: 'username',
            description: 'Usuário não cadastrado',
          },
        ],
      });
    }

    if (loggedUser._id.toString() === targetUser._id.toString()) {
      return response.status(400).json({
        errors: [
          {
            property: 'username',
            description: 'Você não pode adicionar a si mesmo',
          },
        ],
      });
    }

    if (loggedUser.friends_ids.includes(targetUser._id)) {
      return response.status(400).json({
        errors: [
          {
            property: 'username',
            description: 'Você já tem esse usuário como amigo',
          },
        ],
      });
    }

    loggedUser.friends_ids.push(targetUser._id);
    targetUser.friends_ids.push(loggedUser._id);

    await loggedUser.save();
    await targetUser.save();

    return response.status(201).json({
      message: 'Amigo adicionado com sucesso!',
      user: loggedUser,
    });
  }
}
