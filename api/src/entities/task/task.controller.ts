import { Body, Controller, Post, Res, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
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
}
