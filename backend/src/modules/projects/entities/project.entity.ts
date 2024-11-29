import { AbstractEnttiy } from 'src/database/abstract.entity';
import { TaskEntity } from 'src/modules/tasks/entities/task.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { WorkspaceEntity } from 'src/modules/workspaces/entities/workspace.entity';
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

@Entity('projects')
@Index(['ownerId', 'workspaceId'])
export class ProjectEntity extends AbstractEnttiy<ProjectEntity> {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'varchar' })
  logo: string;

  @Column({ type: 'varchar' })
  ownerId: string;

  @Column({ type: 'varchar' })
  workspaceId: string;

  @Column({ type: 'text' })
  color: string;

  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];

  @ManyToOne(() => User, (user) => user.projects, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  owner: User;

  @ManyToOne(() => WorkspaceEntity, (ws) => ws.projects, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  workspace: WorkspaceEntity;
}
