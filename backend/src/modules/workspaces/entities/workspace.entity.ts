import { AbstractEnttiy } from 'src/database/abstract.entity';
import { WorkspaceMemberEntity } from 'src/modules/members/entities/member.entity';
import { ProjectEntity } from 'src/modules/projects/entities/project.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

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

  @OneToMany(() => ProjectEntity, (proj) => proj.workspace)
  projects: ProjectEntity[];

  @OneToMany(() => WorkspaceMemberEntity, (member) => member.workspace)
  members: WorkspaceMemberEntity[];
}
