import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity, Column,
  CreateDateColumn, Entity, Index, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column('varchar')
  code: string;

  @Column('varchar', {
    nullable: true
  })
  description?: string;

  @ManyToMany(
    () => User,
    user => user.roles
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
