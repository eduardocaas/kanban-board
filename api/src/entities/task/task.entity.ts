import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { StatusTaskEnum } from './task.enum';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

@Entity({ name : 'task' })
export class Task {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ 
    type: 'varchar', 
    length: 100, 
    nullable: false 
  })
  title: string;

  @Column({ 
    type: 'varchar',
    length: 255,
    nullable: true
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: StatusTaskEnum.BACKLOG,
    nullable: false
  })
  status: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'fk_project_id' })
  @Column({ nullable: false })
  fk_project_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fk_user_id' })
  @Column({ nullable: false })
  fk_user_id: number;

}