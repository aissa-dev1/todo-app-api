import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'tasks' })
export class TaskEntity extends Document {
  @Prop()
  userId: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  completed: boolean;

  @Prop()
  createdAt: number;
}

export const TaskEntitySchema = SchemaFactory.createForClass(TaskEntity);
