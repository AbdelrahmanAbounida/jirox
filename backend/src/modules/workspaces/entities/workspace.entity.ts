import { AbstractEnttiy } from 'src/database/abstract.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';

// @Entity('workspaces')
// export class WorkspaceEntity extends AbstractEnttiy<WorkspaceEntity> {
//   @Column({ type: 'nvarchar', length: 50, nullable: false })
//   name: string;

//   @Column({ type: 'varchar' })
//   logo: string;

//   @ManyToOne(() => User, (user) => user.workspaces, { cascade: true })
//   @JoinColumn({ name: 'ownerId' })
//   owner: User;
// }

@Entity('workspaces')
@Index('IDX_OWNER_ID', ['ownerId'])
@Unique('IDX_OWNERID_NAME_UNIQUE', ['ownerId', 'name'])
export class WorkspaceEntity extends AbstractEnttiy<WorkspaceEntity> {
  @Column({ type: 'nvarchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar' })
  logo: string;

  @Column({ type: 'varchar', nullable: false })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.workspaces)
  @JoinColumn({ name: 'ownerId' })
  owner: User;
}
