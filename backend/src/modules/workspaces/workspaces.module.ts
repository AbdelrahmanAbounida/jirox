import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { AwsS3Service } from 'src/common/services/aws/services/aws.s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { WorkspaceMemberEntity } from './entities/member.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity, WorkspaceMemberEntity, User]),
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, AwsS3Service],
})
export class WorkspacesModule {}
