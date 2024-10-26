import { AbstractEnttiy } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class WorkspaceEntity extends AbstractEnttiy<WorkspaceEntity> {
  @Column({ type: 'nvarchar', length: 50, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: false })
  ownerId: string;

  @Column({ type: 'text' })
  slug: string;
}
