import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskEnum } from '../enums/task.enum';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  _id?: string;

  @IsOptional()
  id?: string;
}

export class UpdateTaskPositionDto {
  @IsString()
  taskId: string;

  @IsNumber()
  newPosition: number;

  @IsEnum(TaskEnum)
  newStatus: TaskEnum; // new status means new col
}
