import * as bcrypt from 'bcryptjs';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Language } from '../../../entities/language.entity';
import { Role } from '../../../entities/role.entity';

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

  @Column({
    type: 'varchar',
    select: false
  })
  password: string;

  @Column({
    select: false,
    nullable: true
  })
  salt: string;

  @CreateDateColumn({
    select: false
  })
  created: Date;

  @UpdateDateColumn({
    select: false
  })
  modified: Date;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    }
  })
  roles?: Role[];

  @ManyToOne(() => Language, (language) => language.users, { eager: true })
  @JoinColumn({ name: 'language_id' })
  language?: Language;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

}
