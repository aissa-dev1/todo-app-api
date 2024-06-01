import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class UserEntity extends Document {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  userName: string;

  @Prop()
  joinedAt: number;
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);
