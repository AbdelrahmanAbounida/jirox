import { IsDate, IsEnum, IsString } from 'class-validator';
import { TaskEnum } from '../enums/task.enum';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsDate()
  dueDate: Date;

  @IsEnum(TaskEnum)
  status: TaskEnum;

  @IsString()
  assigneeId: string;

  @IsString()
  projectId: string;
}
