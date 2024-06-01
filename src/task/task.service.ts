import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskEntity } from './task.model';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import {
  DeleteUserTaskParams,
  DeleteUserTasksParams,
  FindUserTaskParams,
  FindUserTasksParams,
  TaskCompletionParams,
  UpdateTaskParams,
} from './task.types';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TaskEntity.name) private taskModel: Model<TaskEntity>,
  ) {}

  async findUserTasks(params: FindUserTasksParams) {
    const tasks = await this.findAll({ userId: params.userId });
    return { tasks };
  }

  async findUserTask(params: FindUserTaskParams) {
    const task = await this.findOne({
      _id: params.taskId,
    });

    if (!task) {
      throw new NotFoundException('No task found with the given id');
    }

    return { task };
  }

  async createOne(dto: CreateTaskDto) {
    const createdTask = await this.taskModel.create({
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
      completed: false,
      createdAt: Date.now(),
    });
    await createdTask.save();
    return {
      task: createdTask,
      message: `Task with title ${dto.title} created successfully`,
    };
  }

  async updateTask(dto: UpdateTaskDto, params: UpdateTaskParams) {
    const task = await this.findOne({ _id: params.taskId });

    if (!task) {
      throw new NotFoundException('No task found with the given id');
    }

    await task.updateOne({
      title: dto.title,
      description: dto.description,
    });
    return { message: 'Task updated successfully' };
  }

  async completeTask(params: TaskCompletionParams) {
    const task = await this.findOne({ _id: params.taskId });

    if (!task) {
      throw new NotFoundException('No task found with the given id');
    }

    await task.updateOne({
      completed: true,
    });
    return { message: 'Task completed successfully' };
  }

  async uncompleteTask(params: TaskCompletionParams) {
    const task = await this.findOne({ _id: params.taskId });

    if (!task) {
      throw new NotFoundException('No task found with the given id');
    }

    await task.updateOne({
      completed: false,
    });
    return { message: 'Task uncompleted successfully' };
  }

  async deleteUserTask(params: DeleteUserTaskParams) {
    const task = await this.findOne({ _id: params.taskId });

    if (!task) {
      throw new NotFoundException('No task found with the given id');
    }

    await task.deleteOne();
    return { message: 'Task deleted successfully' };
  }

  async deleteUserTasks(params: DeleteUserTasksParams) {
    const tasks = await this.findAll({ userId: params.userId });
    tasks.forEach(async (task) => {
      await task.deleteOne();
    });
    return { message: 'Tasks deleted successfully' };
  }

  async findAll(
    filter?: FilterQuery<TaskEntity>,
    projection?: ProjectionType<TaskEntity>,
  ) {
    const tasks = await this.taskModel.find(filter, projection);
    return tasks;
  }

  async findOne(
    filter: FilterQuery<TaskEntity>,
    projection?: ProjectionType<TaskEntity>,
  ) {
    const task = await this.taskModel.findOne(filter, projection);
    return task;
  }
}
