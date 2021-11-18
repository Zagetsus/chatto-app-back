import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
