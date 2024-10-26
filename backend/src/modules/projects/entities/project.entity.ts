import { AbstractEnttiy } from 'src/database/abstract.entity';
import { TaskEntity } from 'src/modules/tasks/entities/task.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class ProjectEntity extends AbstractEnttiy<ProjectEntity> {
  @Column({ type: 'text' })
  name: string;

  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];
}
