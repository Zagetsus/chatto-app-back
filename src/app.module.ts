import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://wolf:MHCC7NEmHoszDFJl@chattoapp.jrhnz.mongodb.net/chattodb?retryWrites=true&w=majority',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
