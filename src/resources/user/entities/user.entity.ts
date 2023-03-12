import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn, ManyToOne, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Language } from './language.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column('varchar')
  username: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  email?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  surname?: string;

  @Column({
    nullable: false,
    default: true
  })
  enabled?: boolean;


  @CreateDateColumn({
    select: false
  })
  created: Date;

  @UpdateDateColumn({
    select: false
  })
  modified: Date;

  @ManyToOne(() => Language, (language) => language.users, { eager: true })
  @JoinColumn({ name: 'language_id' })
  language?: Language;


}
