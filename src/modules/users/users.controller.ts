import {
  Controller,
  Post,
  Body,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from '../../domain/users/entities';
import { CreateUserDto } from '../../domain/users/dto';
import { checkIfUserRoleIsValid } from '../../utils/users';
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
    const isRoleValid: boolean = checkIfUserRoleIsValid(body.role);
    if (!isRoleValid) {
      throw new BadRequestException('Invalid User Role');
    }
    return await this.usersService.createUser(body);
  }
}
