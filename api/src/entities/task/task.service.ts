import { BadRequestException, ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { FindManyOptions, FindOneOptions } from 'typeorm';

@Injectable()
export class TaskService {

  constructor(@InjectRepository(Task) 
              private readonly taskRepository: TaskRepository,
              /*private readonly projectService: ProjectService,
              private readonly userService: UserService*/) {}

  async save(task: Task): Promise<Task> {
    this.validateTask(task);

    const options: FindOneOptions = { where: { title: task.title } };
    const obj = await this.taskRepository.findOne(options);
    
    if (obj /*&& (obj.fk_project_id == task.fk_project_id)*/) {
      throw new ConflictException('Title is already in use');
    }
    
   /* const project = await this.projectService.findById(task.fk_project_id);
    if (!project) {
      throw new NotFoundException(`Project with id: ${task.fk_project_id} not found`);
    }

    const user = await this.userService.findById(task.fk_user_id);
    if (!user) {
      throw new NotFoundException(`User with id: ${task.fk_user_id} not found`);
    }*/
    
    return this.taskRepository.save(task);
  }

  async update(task: Task): Promise<Task> {
    const findTask = await this.findById(task.id);
    if (!findTask) {
      throw new NotFoundException(`Task with id: ${task.id} not found`);
    }

    if (findTask.title != task.title) {
      this.validateTitle(task);
    }

    this.validateStatus(task)
    this.validateTask(task);

    const obj = await this.taskRepository.update(task.id, task);
    if (!obj) {
      throw new InternalServerErrorException("Server error updating task");
    } 
    
    return this.findById(task.id);
  }

  private findById(id: number): Promise<Task> {
    const obj = this.taskRepository.findOne({ where: { id: id } });
    if(!obj) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return obj;
  }

  async getById(id: number): Promise<Task> {
    const obj = await this.taskRepository.findOne({ where: { id: id } });
    if(!obj) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    return obj;
  }

  async findByProjectId(id: number): Promise<Task[]> {
    const options: FindManyOptions = {
      where: { fk_project_id: id }
    }
    return this.taskRepository.find(options);
  }

  async delete(id: number): Promise<void> {
    const findTask = await this.findById(id);
    if (!findTask) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
    this.taskRepository.delete(findTask);
  }


  private async validateTitle(task: Task): Promise<void> {
    const options: FindOneOptions = { where: { title: task.title } };
    const obj = await this.taskRepository.findOne(options);
    if (obj && obj.id !== task.id) {
      throw new ConflictException('Title is already in use');
    } 
  }

  private validateTask(task: Task): void {
    if (!task.title || task.title.trim().length === 0) {
      throw new BadRequestException('Task title must not be blank');
    }

    if (!task.description || task.description.trim().length === 0) {
      throw new BadRequestException('Task description must not be blank');
    }
 
    if (task.title.length < 4) {
      throw new BadRequestException('Title must have at least 4 characters');
    }

    if (task.description.length < 5) {
      throw new BadRequestException('Description must have at least 5 characters');
    }

    if (!task.fk_project_id) {
      throw new BadRequestException('Project must not be null');
    }

    if (!task.fk_user_id) {
      throw new BadRequestException('User must not be null');
    }
  }

  private validateStatus(task: Task): void {
    if (!['BACKLOG', 'DOING', 'DONE'].includes(task.status)) {
      throw new BadRequestException("Invalid status! Choose one of them: 'BACKLOG', 'DOING', 'DONE'");
    }
  }
}
