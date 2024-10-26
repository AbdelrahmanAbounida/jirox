import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AbstractEnttiy<T> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
