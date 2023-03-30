import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Language } from './language.entity';
import { UserRecipe } from './user-recipe.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  uid: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  email?: string;

  @Column({ type: 'varchar', name: 'username', nullable: true })
  userName?: string;

  @Column({ type: 'varchar', length: 8000 })
  avatar: string;

  @Column({ type: 'varchar', length: 1, nullable: true })
  gender?: string;

  @Column({type: 'float', nullable: true})
  weight?: number;

  @Column({type: 'float', nullable: true})
  height?: number;

  @Column({type: 'int', nullable: true})
  age?: number;

  @Column({ type: 'varchar', name: 'activity_level', nullable: true })
  activityLevel?: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  modified: Date;

  @ManyToOne(() => Language, (language) => language.users)
  @JoinColumn({ name: 'language_id' })
  language?: Language;

  @OneToMany(() => UserRecipe, (userRecipe) => userRecipe.user)
  recipes: UserRecipe[];
}
