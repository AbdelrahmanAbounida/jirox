import { AbstractEnttiy } from 'src/database/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TaskEnum } from '../enums/task.enum';
import { ProjectEntity } from 'src/modules/projects/entities/project.entity';
import { WorkspaceMemberEntity } from 'src/modules/workspaces/entities/member.entity';

@Entity()
export class TaskEntity extends AbstractEnttiy<TaskEntity> {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'enum', enum: TaskEnum })
  status: TaskEnum;

  @ManyToOne(() => WorkspaceMemberEntity, (member) => member.tasks, {
    cascade: true,
  })
  @JoinColumn({ name: 'assigneeId' })
  assignee: WorkspaceMemberEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.tasks, { cascade: true })
  @JoinColumn({ name: 'projectId' }) // define col as projectId
  project: ProjectEntity;
}
