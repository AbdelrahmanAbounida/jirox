import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterLoad,
  AfterRemove,
  AfterUpdate,
  Entity,
  ObjectIdColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class AbstractEnttiy<T> {
  @ObjectIdColumn({ name: '_id' })
  @Exclude()
  _id: string;

  @PrimaryColumn()
  @ObjectIdColumn()
  id: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  @AfterRemove()
  assingIdFromObjectId() {
    this.id = this._id.toString();
  }
}
