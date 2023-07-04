import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class TaskService {

  constructor(@InjectRepository(Task) 
              private readonly taskRepository: TaskRepository,
              private readonly projectService: ProjectService,
              private readonly userService: UserService) {}

  async save(task: Task): Promise<Task> {
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

    const options: FindOneOptions = { where: { title: task.title } };
    const obj = await this.taskRepository.findOne(options);
    if (obj) {
      throw new ConflictException('Title is already in use');
    }

    const project = await this.projectService.findById(task.fk_project_id);
    if (!project) {
      throw new NotFoundException(`Project with id: ${task.fk_project_id} not found`);
    }

    const user = await this.projectService.findById(task.fk_user_id);
    if (!user) {
      throw new NotFoundException(`User with id: ${task.fk_user_id} not found`);
    }

    return this.taskRepository.save(task);
  }
}
