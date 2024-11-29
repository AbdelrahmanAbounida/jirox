import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskEnum } from '../enums/task.enum';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsDate()
  dueDate: Date;

  @IsEnum(TaskEnum)
  status: TaskEnum;

  @IsString()
  @IsOptional()
  assigneeId?: string;

  @IsString()
  projectId: string;
}
