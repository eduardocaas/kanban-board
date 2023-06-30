import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name : 'project' })
export class Project {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: Number;

  @Column({ 
    type: 'varchar', 
    length: 100,
    unique: true,
    nullable: false 
  })
  title: String;

}