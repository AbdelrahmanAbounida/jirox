import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
}
