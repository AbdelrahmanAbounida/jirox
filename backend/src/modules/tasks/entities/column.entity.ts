import { AbstractEnttiy } from 'src/database/abstract.entity';
import { ProjectEntity } from 'src/modules/projects/entities/project.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { TaskEntity } from './task.entity';

@Entity('columns')
@Unique(['name'])
@Index(['name'])
export class ColumnEntity extends AbstractEnttiy<ColumnEntity> {
  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  projectId: string;

  @Column({ type: 'number' })
  position: number;

  @ManyToOne(() => ProjectEntity, (project) => project.tasks, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: ProjectEntity;

  @OneToMany(() => TaskEntity, (task) => task.column, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  tasks: TaskEntity[];
}
