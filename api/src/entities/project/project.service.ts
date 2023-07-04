import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectRepository } from './project.repository';
import { Equal, FindOneOptions } from 'typeorm';

@Injectable()
export class ProjectService {

  constructor(@InjectRepository(Project) private readonly projectRepository: ProjectRepository) {}

  async save(project: Project): Promise<Project> {
    if(!project.title || project.title.trim().length === 0) {
      throw new BadRequestException('Project title must not be blank');
    }

    if(project.title.length < 4) {
      throw new BadRequestException('Title must have at least 4 characters');
    }

    const options: FindOneOptions = { where: {title : project.title}};
    const obj = await this.projectRepository.findOne(options);
    if(obj) {
      throw new ConflictException('Title is already in use');
    }

    return this.projectRepository.save(project);
  }

  async findById(id: number): Promise<Project> {
    const options: FindOneOptions = { where: { id: id } };
    return this.projectRepository.findOne(options);
  }
}
