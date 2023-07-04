import { BadRequestException, Body, ConflictException, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Response } from 'express';

@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  private readonly uri = "http://localhost:3000/user";

  @Post()
  async save(@Body() user: User, @Res() res: Response): Promise<void> {
    try {
      const obj = await this.userService.save(user);
      const local = `${this.uri}/${obj.id}`;
      res.location(local);
      res.sendStatus(201);
    } 
    catch (error) {
      console.error(error);

      let statusCode = 500;
      let errorMessage = "Error saving User!";
      let timestamp = new Date().toISOString();

      if (error instanceof BadRequestException) {
        statusCode = 400;
        errorMessage = error.message;
      } else if (error instanceof ConflictException) {
        statusCode = 409;
        errorMessage = error.message;
      }

      res.status(statusCode).send({ message: errorMessage, timestamp });
    }
  }
}
