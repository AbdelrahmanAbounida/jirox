import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { AwsS3Service } from 'src/common/services/aws/services/aws.s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { User } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { ProjectEntity } from '../projects/entities/project.entity';
import { WorkspaceMemberEntity } from '../members/entities/member.entity';
import { TaskEntity } from '../tasks/entities/task.entity';
import { KanbanService } from '../tasks/kanban.services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkspaceEntity,
      User,
      ProjectEntity,
      TaskEntity,
      WorkspaceMemberEntity,
    ]),
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, AwsS3Service, ProjectsService, KanbanService],
})
export class WorkspacesModule {}
