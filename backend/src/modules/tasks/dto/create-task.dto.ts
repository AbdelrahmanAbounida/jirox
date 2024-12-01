import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskEnum } from '../enums/task.enum';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsEnum(TaskEnum)
  status: TaskEnum;

  @IsString()
  @IsOptional()
  assigneeId?: string;

  @IsString()
  projectId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  position: number; // load number of column tasks with this status
}
