import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserEntity } from '../../domain/users/entities';
import { CreateUserDto } from '../../domain/users/dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    createUserDto.password = await this.authService.hashPassword(
      createUserDto.password,
    );
    const createdUser = await this.usersRepository.createUser(createUserDto);
    const user = await this.usersRepository.getUserById(createdUser.id);
    return user;
  }
}
