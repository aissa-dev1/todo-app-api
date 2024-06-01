export type FindUserTasksParams = {
  userId: string;
};

export type FindUserTaskParams = {
  taskId: string;
};

export type UpdateTaskParams = FindUserTaskParams;

export type TaskCompletionParams = UpdateTaskParams;

export type DeleteUserTaskParams = TaskCompletionParams;

export type DeleteUserTasksParams = FindUserTasksParams;
