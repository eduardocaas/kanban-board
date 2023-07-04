import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectRepository } from './project.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectRepository])],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository]
})
export class ProjectModule {}
