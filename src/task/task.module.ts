import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskEntity, TaskEntitySchema } from './task.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TaskEntity.name,
        schema: TaskEntitySchema,
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
