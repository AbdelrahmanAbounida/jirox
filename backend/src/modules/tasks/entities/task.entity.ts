import { AbstractEnttiy } from 'src/database/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TaskEnum } from '../enums/task.enum';
import { ProjectEntity } from 'src/modules/projects/entities/project.entity';
import { WorkspaceMemberEntity } from 'src/modules/members/entities/member.entity';

@Entity('tasks')
@Index(['projectId'])
export class TaskEntity extends AbstractEnttiy<TaskEntity> {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ type: 'enum', enum: TaskEnum })
  status: TaskEnum;

  @Column({ type: 'varchar', nullable: true })
  assigneeId?: string;

  @Column({ type: 'varchar' })
  projectId: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  // kanban
  @Column({ type: 'number', nullable: false })
  position: number; // project

  @Column({ type: 'number' })
  wokrspacePosition: number; // wokrspace Position

  // relations
  @ManyToOne(() => WorkspaceMemberEntity, (member) => member.tasks, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assigneeId' })
  assignee?: WorkspaceMemberEntity;

  // @Exclude()
  @ManyToOne(() => ProjectEntity, (project) => project.tasks, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' }) // define col as projectId
  project: ProjectEntity;
}
