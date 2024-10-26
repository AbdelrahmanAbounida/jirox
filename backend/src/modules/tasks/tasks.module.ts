import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { WorkspaceMemberEntity } from '../workspaces/entities/member.entity';
import { ProjectEntity } from '../projects/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      WorkspaceMemberEntity,
      ProjectEntity,
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
