import { Type } from 'class-transformer';
import { User } from 'src/resources/user/entities/user.entity';

import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'password_reset_requests' })
export class PasswordResetRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  token: string;

  @CreateDateColumn()
  created: Date;

  @Column('int', { default: 0 })
  fulfilled: boolean;

  @ManyToOne(
    () => User,
    user => user.id,
    { eager: true }
  )
  @Type(() => User)
  user: User;
}
