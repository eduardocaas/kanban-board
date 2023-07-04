import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: UserRepository) {}

  async save(user: User): Promise<User> {
    if (!user.name || user.name.trim().length === 0) {
      throw new BadRequestException('User name must not be blank');
    }

    if (!user.username || user.username.trim().length === 0) {
      throw new BadRequestException('Username must not be blank');
    }

    if (user.name.length < 3) {
      throw new BadRequestException('User name must have at least 3 characters');
    }

    if (user.username.length < 3) {
      throw new BadRequestException('Username must have at least 3 characters');
    }

    if (!user.password) {
      throw new BadRequestException('Password is required');
    }

    const passwordMinLength = 8;
    if (user.password.length < passwordMinLength) {
      throw new BadRequestException(`Password must be at least ${passwordMinLength} characters`);
    }

    const options: FindOneOptions = { where: {username: user.username}};
    const obj = await this.userRepository.findOne(options);
    if (obj) {
      throw new ConflictException('Username is already in use');
    }

    return this.userRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    const options: FindOneOptions = { where: { id: id } };
    return this.userRepository.findOne(options);
  }
}
