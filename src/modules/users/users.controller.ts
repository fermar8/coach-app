import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../domain/users/entities';
import { CreateUserDto } from '../../domain/users/dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    const user = await this.usersService.createUser(body);
    return user;
  }
}
