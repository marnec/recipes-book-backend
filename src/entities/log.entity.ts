import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'logs' })
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    nullable: true
  })
  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsNotEmpty()
  @Column('varchar')
  status: string;

  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar',  length: 4000 })
  message: string;

  @IsString()
  @IsOptional()
  @Column({ type: 'varchar',  length: 4000, nullable: true })
  stack: string;

  @IsString()
  @IsOptional()
  @Column({ type: 'varchar',  length: 4000, nullable: true, name: 'request_body' })
  requestBody: string;

  @IsString()
  @IsOptional()
  @Column({ type: 'varchar',  length: 4000, nullable: true, name: 'request_params' })
  requestParams: string;

  @CreateDateColumn()
  created: Date;
}
