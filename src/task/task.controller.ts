import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { TaskService } from './task.service';
import {
  DeleteUserTaskParams,
  DeleteUserTasksParams,
  FindUserTaskParams,
  FindUserTasksParams,
  TaskCompletionParams,
  UpdateTaskParams,
} from './task.types';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('users/:userId')
  findUserTasks(@Param() params: FindUserTasksParams) {
    return this.taskService.findUserTasks(params);
  }

  @Get(':taskId/users/:userId')
  findUserTask(@Param() params: FindUserTaskParams) {
    return this.taskService.findUserTask(params);
  }

  @Post()
  createOne(@Body() dto: CreateTaskDto) {
    return this.taskService.createOne(dto);
  }

  @Patch('update-task/:taskId')
  updateTask(@Body() dto: UpdateTaskDto, @Param() params: UpdateTaskParams) {
    return this.taskService.updateTask(dto, params);
  }

  @Patch('complete-task/:taskId')
  completeTask(@Param() params: TaskCompletionParams) {
    return this.taskService.completeTask(params);
  }

  @Patch('uncomplete-task/:taskId')
  uncompleteTask(@Param() params: TaskCompletionParams) {
    return this.taskService.uncompleteTask(params);
  }

  @Delete(':taskId')
  deleteUserTask(@Param() params: DeleteUserTaskParams) {
    return this.taskService.deleteUserTask(params);
  }

  @Delete('users/:userId')
  deleteUserTasks(@Param() params: DeleteUserTasksParams) {
    return this.taskService.deleteUserTasks(params);
  }
}
