import { Exclude, Expose } from 'class-transformer';
import {
  AfterInsert,
  AfterLoad,
  AfterRemove,
  AfterUpdate,
  Entity,
  ObjectIdColumn,
  PrimaryColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class AbstractEnttiy<T> {
  @ObjectIdColumn({ name: '_id' })
  @Exclude()
  _id: ObjectId; // string;

  @PrimaryColumn()
  @ObjectIdColumn()
  @Expose()
  id: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  @AfterRemove()
  assingIdFromObjectId() {
    if (this._id) {
      this.id = this._id.toString(); // || uuidv4();
    }
  }
}
