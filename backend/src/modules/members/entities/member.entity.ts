import { AbstractEnttiy } from 'src/database/abstract.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  getRepository,
  Index,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { WORKSPACE_MEMBER_ROLE } from '../enums/member.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { WorkspaceEntity } from 'src/modules/workspaces/entities/workspace.entity';
import { TaskEntity } from 'src/modules/tasks/entities/task.entity';

// @Index(['email', 'workspaceId'], { unique: true })
@Entity('members')
// @Unique(['userId', 'workspaceId'])
export class WorkspaceMemberEntity extends AbstractEnttiy<WorkspaceMemberEntity> {
  @Column({ type: 'varchar', unique: false })
  email: string; // not userid as user might not exist

  @Column({ type: 'varchar' })
  workspaceId: string;

  @Column({ type: 'varchar', nullable: true })
  userId?: string;

  @Column({ type: 'enum', enum: WORKSPACE_MEMBER_ROLE })
  role: WORKSPACE_MEMBER_ROLE;

  @Column({ type: 'boolean', default: false })
  active: boolean; // check if user accepts the invitation

  @ManyToOne(() => WorkspaceEntity, (ws) => ws.members, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  workspace: WorkspaceEntity;

  @OneToMany(() => TaskEntity, (task) => task.assignee)
  tasks: TaskEntity[];

  // @ManyToOne(() => User, (user) => user.memberships, {
  //   nullable: true,
  //   cascade: true,
  //   createForeignKeyConstraints: false,
  // })
  // user?: User;
}
