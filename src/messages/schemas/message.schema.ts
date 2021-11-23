import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type messageDocument = Message & mongoose.Document;

@Schema()
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  from_id: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  to_id: User;

  @Prop({ required: true })
  body: string;

  @Prop({ default: false })
  view: boolean;

  @Prop({ type: Date, default: Date.now() })
  created_at: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
