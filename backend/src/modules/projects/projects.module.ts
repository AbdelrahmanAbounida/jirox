import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { TaskEntity } from '../tasks/entities/task.entity';
import { WorkspaceMemberEntity } from '../members/entities/member.entity';
import { AwsS3Service } from 'src/common/services/aws/services/aws.s3.service';
import { KanbanService } from '../tasks/kanban.services';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      TaskEntity,
      WorkspaceMemberEntity,
    ]),
    forwardRef(() => TasksModule),
  ],
  controllers: [ProjectsController],
  providers: [AwsS3Service, ProjectsService, KanbanService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
