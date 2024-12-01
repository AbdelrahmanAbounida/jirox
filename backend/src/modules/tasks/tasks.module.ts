import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { ProjectEntity } from '../projects/entities/project.entity';
import { WorkspaceMemberEntity } from '../members/entities/member.entity';
import { KanbanService } from './kanban.services';
import { WorkspaceEntity } from '../workspaces/entities/workspace.entity';
import { ProjectsModule } from '../projects/projects.module';
import { AwsS3Service } from 'src/common/services/aws/services/aws.s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      WorkspaceMemberEntity,
      ProjectEntity,
      WorkspaceEntity,
    ]),
    forwardRef(() => ProjectsModule),
  ],
  controllers: [TasksController],
  providers: [TasksService, KanbanService],
})
export class TasksModule {}
