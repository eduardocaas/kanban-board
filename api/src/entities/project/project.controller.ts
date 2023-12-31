import { BadRequestException, Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { Project } from './project.entity';
import e, { Response } from 'express';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {

  constructor(private readonly projectService: ProjectService) {}
 
  private readonly uri = "http://localhost:3000/project";

  @Post()
  async save(@Body() project: Project, @Res() res: Response): Promise<void> {
    try {
      const obj = await this.projectService.save(project);
      const local = `${this.uri}/${obj.id}`;
      res.location(local);
      res.status(201).send({ message: 'Created' });
    } 
    catch (error) {
      console.error(error);
      let statusCode = 500;
      let errorMessage = "Server error saving project";
      let timestamp = new Date().toISOString();

      if (error instanceof BadRequestException) {
        statusCode = 400;
        errorMessage = error.message;
      }
      else if (error instanceof ConflictException) {
        statusCode = 409;
        errorMessage = error.message;
      }
      
      res.status(statusCode).send({ message: errorMessage, timestamp });
    }
  }

  @Get()
  async getAll(@Res() res: Response): Promise<void> {
    try {
      const projects: Project[] = await this.projectService.findAll();
      res.status(200).send(projects);
    }
    catch (error) {
      console.error(error);
      let timestamp = new Date().toISOString();
      res.status(500).send({ message: "Server error getting projects", timestamp });
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: number, @Res() res: Response): Promise<void> {
    try {
      await this.projectService.delete(id);
      res.status(204).send();
    }
    catch (error) {
      console.error(error);
      let statusCode = 500;
      let errorMessage = 'Server error deleting project';
      let timestamp = new Date().toISOString();

      if (error instanceof NotFoundException) {
        statusCode = 404;
        errorMessage = error.message;
      }

      res.status(statusCode).send({ message: errorMessage, timestamp });
    }
  }
}
