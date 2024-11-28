import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../tasks/entities/task.entity';
import { WorkspaceMemberEntity } from './entities/member.entity';
import { WorkspaceEntity } from '../workspaces/entities/workspace.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      WorkspaceMemberEntity,
      WorkspaceEntity,
      User,
    ]),
  ],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
