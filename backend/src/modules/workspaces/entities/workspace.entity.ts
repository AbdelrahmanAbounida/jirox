import { AbstractEnttiy } from 'src/database/abstract.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class WorkspaceEntity extends AbstractEnttiy<WorkspaceEntity> {
  @Column({ type: 'nvarchar', length: 50, nullable: false, unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.workspaces, { cascade: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;
}
