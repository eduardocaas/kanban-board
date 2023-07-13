import { Body, Controller, Post, Res, Param, Get, BadRequestException, NotFoundException, ConflictException, Put, InternalServerErrorException, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { Response } from 'express';

@Controller('task')
export class TaskController {

  constructor(private readonly taskService: TaskService) { }

  private readonly uri = "http://localhost:3000/task";

  @Get('/:id')
  async getByProjectId(@Param("id") id: number, @Res() res: Response): Promise<void> {
    try {
      const tasks: Task[] = await this.taskService.findByProjectId(id);
      res.status(200).send(tasks);
    } 
    catch (error) {
      console.error(error);
      let timestamp = new Date().toISOString();
      res.status(500).send({ message: "Server error getting Tasks with Project ID", timestamp});
    }
  }

  @Get('/get/:id')
  async getById(@Param("id") id: number, @Res() res: Response): Promise<void> {
    try {
      const task = await this.taskService.getById(id);
      res.status(200).send(task);
    } 
    catch (error) {
      console.error(error);
      let statusCode = 500;
      let errorMessage = 'Server error getting Task with ID'
      let timestamp = new Date().toISOString();
      
      if (error instanceof NotFoundException) {
        statusCode = 404;
        errorMessage = error.message;
      }

      res.status(statusCode).send({ message: errorMessage, timestamp });
    }
  }


  @Post()
  async save(@Body() task: Task, @Res() res: Response): Promise<void> {
    try {
      const obj = await this.taskService.save(task);
      const local = `${this.uri}/${obj.id}`;
      res.location(local);
      res.status(201).send({ message: 'Created' });
    }
    catch (error) {
      console.error(error);
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
      console.error(error);
      let statusCode = 500;
      let errorMessage = 'Server error updating task';
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
      else if (error instanceof InternalServerErrorException) {
        statusCode = 500;
        errorMessage = error.message;
      }

      res.status(statusCode).send({ message: errorMessage, timestamp });
    }
  }

  @Delete("/:id")
  async delete(@Param('id') id: number, @Res() res: Response): Promise<void> {
    try {
      await this.taskService.delete(id);
      res.status(204).send();
    }
    catch (error) {
      console.error(error);
      let statusCode = 500;
      let errorMessage = 'Server error deleting task';
      let timestamp = new Date().toISOString();

      if (error instanceof NotFoundException) {
        statusCode = 404;
        errorMessage = error.message;
      }

      res.status(statusCode).send({ message: errorMessage, timestamp });
    }
  }
}
