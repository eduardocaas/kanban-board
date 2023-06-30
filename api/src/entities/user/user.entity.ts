import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../project/project.entity';

@Entity({ name: 'user' })
export class User {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: Number;

  @Column({ 
    type: 'varchar', 
    length: 100,
    nullable: false 
  })
  name: String;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false
  })
  username: String;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  password: String;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'fk_project_id' })
  @Column({ nullable: true })
  fk_project_id: Project;

}