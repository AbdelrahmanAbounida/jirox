import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { AwsS3Service } from 'src/common/services/aws/services/aws.s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, AwsS3Service],
})
export class WorkspacesModule {}
