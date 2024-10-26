import { AbstractEnttiy } from 'src/database/abstract.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { WORKSPACE_MEMBER_ROLE } from '../enums/member.enum';
import { TaskEntity } from 'src/modules/tasks/entities/task.entity';

@Entity()
@Unique(['userEmail', 'workspaceId'])
export class WorkspaceMemberEntity extends AbstractEnttiy<WorkspaceMemberEntity> {
  @Column({ type: 'text' })
  userEmail: string;

  @Column({ type: 'text' })
  workspaceId: string;

  @Column({ type: 'boolean', default: false })
  isActive?: boolean;

  @Column({ type: 'enum', enum: WORKSPACE_MEMBER_ROLE })
  role: WORKSPACE_MEMBER_ROLE;

  @OneToMany(() => TaskEntity, (task) => task.assignee)
  tasks: TaskEntity[];
}
