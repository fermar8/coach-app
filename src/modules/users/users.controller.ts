import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '.prisma/client';
import { CreateUserBody } from '../../domain/users';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserBody): Promise<User> {
    // dades correctes
    const { name, surname, email, phone, password, userType } = body;
    const user = await this.usersService.createUser(email, password);
    return user;
  }
}
