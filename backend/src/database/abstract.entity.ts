import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AbstractEnttiy<T> {
  @PrimaryGeneratedColumn()
  id: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
