import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'logs' })
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    nullable: true
  })
  code: string;

  @Column('varchar')
  status: string;

  @Column({ type: 'varchar', length: 4000 })
  message: string;

  @Column({ type: 'varchar', length: 4000, nullable: true })
  stack: string;

  @Column({ type: 'varchar', length: 4000, nullable: true, name: 'request_body' })
  requestBody: string;

  @Column({ type: 'varchar', length: 4000, nullable: true, name: 'request_params' })
  requestParams: string;

  @CreateDateColumn()
  created: Date;
}
