import { IsString, Length } from 'class-validator';
import { isValidString } from 'src/decorators/is-valid-string';

export class CreateTaskDto {
  @isValidString('User id')
  userId: string;

  @IsString({ message: 'Task title is required' })
  @Length(1, 50, {
    message: 'Task title must be 1-50 characters long',
  })
  title: string;

  @IsString({ message: 'Task description is required' })
  @Length(1, 125, {
    message: 'Task description must be 1-125 characters long',
  })
  description: string;
}

export class UpdateTaskDto {
  @IsString({ message: 'Task title is required' })
  @Length(1, 50, {
    message: 'Task title must be 1-50 characters long',
  })
  title: string;

  @IsString({ message: 'Task description is required' })
  @Length(1, 50, {
    message: 'Task description must be 1-50 characters long',
  })
  description: string;
}
