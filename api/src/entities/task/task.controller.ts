import { Body, Controller, Post, Res, BadRequestException, NotFoundException, ConflictException, Put, InternalServerErrorException } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { Response } from 'express';

@Controller('task')
export class TaskController {

  constructor(private readonly taskService: TaskService) {}

  private readonly uri = "http://localhost:3000/task";

  @Post()
  async save(@Body() task: Task, @Res() res: Response): Promise<void> {
    try {
      const obj = await this.taskService.save(task);
      const local = `${this.uri}/${obj.id}`;
      res.location(local);
      res.sendStatus(201);
    }
    catch (error) {
      let statusCode = 500;
      let errorMessage = 'Server error saving task';
      let timestamp = new Date().toISOString();

      if (error instanceof BadRequestException) {
        statusCode = 400;
        errorMessage = error.message;
      }
      else if (error instanceof ConflictException) {
        statusCode = 409;
        errorMessage = error.message;
      }
      else if (error instanceof NotFoundException) {
        statusCode = 404;
        errorMessage = error.message;
      }

      res.status(statusCode).send({ message: errorMessage, timestamp });
    }
  }

  @Put()
  async update(@Body() task: Task, @Res() res: Response): Promise<void> {
    try {
      const obj = await this.taskService.update(task);
      res.status(200).send(obj);
    } 
    catch (error) {
      let statusCode = 500;
      let errorMessage = 'Server error updating task';
      let timestamp = new Date().toISOString();

      if (!(error instanceof InternalServerErrorException)) {
        if (error instanceof BadRequestException) {
          statusCode = 400;
        } 
        else if (error instanceof ConflictException) {
          statusCode = 409;
        }
        else if (error instanceof NotFoundException) {
          statusCode = 404;
        } 
        else if (error instanceof InternalServerErrorException) {
          statusCode = 500;
        }
        errorMessage = error.message;
      }

      res.status(statusCode).send({ message: errorMessage, timestamp });
    }
  }
}
