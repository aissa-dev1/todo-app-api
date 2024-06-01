import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'refresh-tokens' })
export class RefreshTokenEntity extends Document {
  @Prop()
  token: string;

  @Prop()
  userId: string;
}

export const RefreshTokenEntitySchema =
  SchemaFactory.createForClass(RefreshTokenEntity);
