import { BadRequestException, Body, ConflictException, Controller, Post, Res } from '@nestjs/common';
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
      res.sendStatus(201);
    } 
    catch (error) {
      console.log(error);
      let statusCode = 500;
      let errorMessage = "Error saving Project";
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
}
