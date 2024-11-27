import { AbstractEnttiy } from 'src/database/abstract.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { USER_ROLE_ENUM } from '../enums/role.enum';
import { Exclude, Expose } from 'class-transformer';
import { WorkspaceEntity } from 'src/modules/workspaces/entities/workspace.entity';
import { NotificationEntity } from 'src/modules/notifications/entities/notification.entity';

@Entity('User')
export class User extends AbstractEnttiy<User> {
  @Column()
  name: string;

  @Column() // { type: 'mediumtext', nullable: true }
  image: string;

  @Column() // , unique: true >> No need as we apply it from prisma
  email: string;

  @Column()
  @Exclude()
  @Expose({ name: 'hashedpassword' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Expose({
    name: 'Verification date',
  })
  emailVerified: Date;

  @Column({ type: 'enum', enum: USER_ROLE_ENUM })
  role: USER_ROLE_ENUM;

  @OneToMany(() => Account, (account) => account.user, { cascade: true })
  accounts: Account[];

  @OneToMany(() => Session, (session) => session.user, { cascade: true })
  sessions: Session[];

  @OneToMany(() => WorkspaceEntity, (workspace) => workspace.owner)
  workspaces: WorkspaceEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];
}

@Entity('Account')
// @Unique(['provider', 'providerAccountId']) // No need as we apply it from prisma
export class Account extends AbstractEnttiy<Account> {
  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  provider: string;

  @Column()
  providerAccountId: string;

  @Column({ type: 'text', nullable: true })
  refresh_token: string;

  @Column({ type: 'text', nullable: true })
  access_token: string;

  @Column({ type: 'int', nullable: true })
  expires_at: number;

  @Column({ nullable: true })
  token_type: string;

  @Column({ nullable: true })
  scope: string;

  @Column({ type: 'text', nullable: true })
  id_token: string;

  @Column({ nullable: true })
  session_state: string;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}

@Entity('Session')
export class Session extends AbstractEnttiy<Session> {
  @Column()
  sessionToken: string;

  @Column()
  userId: string;

  @Column({ type: 'timestamp' })
  expires: Date;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}

@Entity('VerificationToken')
// @Unique(['identifier', 'token']) // No need as we apply it from prisma
export class VerificationToken extends AbstractEnttiy<VerificationToken> {
  @Column()
  identifier: string;

  @Column()
  token: string;

  @Column({ type: 'timestamp' })
  expires: Date;
}
