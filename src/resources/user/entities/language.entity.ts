import {
  BaseEntity, Column,
  CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity({name:'languages'})
export class Language extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column('varchar')
  code: string;

  @Index({ unique: true })
  @Column('varchar')
  i18n: string;

  @OneToMany(
    () => User,
    user => user.language
  )
  users?: User[];

  @CreateDateColumn({
    select: false
  })
  created: Date;

  @UpdateDateColumn({
    select: false
  })
  modified: Date;
}
