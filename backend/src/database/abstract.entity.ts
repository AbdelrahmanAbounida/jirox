import { Exclude, Expose } from 'class-transformer';
import {
  AfterInsert,
  AfterLoad,
  AfterRemove,
  AfterUpdate,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

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
