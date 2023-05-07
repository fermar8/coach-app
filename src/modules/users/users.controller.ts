import {
  Controller,
  Post,
  Body,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from '../../domain/users/entities';
import { CreateUserDto } from '../../domain/users/dto';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async createUser(
    @Body() body: CreateUserDto,
  ): Promise<UserEntity | NotFoundException> {
    return await this.usersService.createUser(body);
  }
}
