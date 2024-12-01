import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { ProjectEntity } from '../projects/entities/project.entity';
import { WorkspaceMemberEntity } from '../members/entities/member.entity';
import { KanbanService } from './kanban.services';
import { ColumnEntity } from './entities/column.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      WorkspaceMemberEntity,
      ProjectEntity,
      ColumnEntity,
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService, KanbanService],
})
export class TasksModule {}
