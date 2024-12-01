import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  _id?: string;

  @IsOptional()
  id?: string;
}
