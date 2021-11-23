import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: number;

  @Prop()
  img_url: string;

  @Prop()
  status: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  friends_ids: User[];

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
