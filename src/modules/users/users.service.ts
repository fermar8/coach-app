import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserEntity } from '../../domain/users/entities';
import { CreateUserDto } from '../../domain/users/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersRepository.createUser(createUserDto);
    return await this.usersRepository.getUserById(user.id);
  }
}
