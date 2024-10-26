import { AbstractEnttiy } from 'src/database/abstract.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class NotificationEntity extends AbstractEnttiy<NotificationEntity> {
  @Column({ type: 'nvarchar', length: 50, nullable: false, unique: true })
  content: string;

  @ManyToOne(() => User, (user) => user.notifications, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
