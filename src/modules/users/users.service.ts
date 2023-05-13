import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserEntity } from '../../domain/users/entities';
import { CreateUserDto, UserDto } from '../../domain/users/dto';
import { AuthService } from '../auth/auth.service';
import { excludeFieldFromObject } from '../../utils/generalUtils';
import UsersModuleErrorMessages from '../../errorHandling/users/errorMessages';

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
    const userWithoutPassword = excludeFieldFromObject(user, ['password']);
    return userWithoutPassword;
  }

  async loginUser(userDto: UserDto): Promise<UserEntity> {
    try {
      const user = await this.usersRepository.getUserByEmail(userDto.email);
      const isPasswordValid = await this.authService.validateUserPassword(
        userDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException();
      }
      const userWithoutPassword = excludeFieldFromObject(user, ['password']);
      return userWithoutPassword;
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof UnauthorizedException
      ) {
        throw new UnauthorizedException(
          UsersModuleErrorMessages.USER_INVALID_CREDENTIALS,
        );
      } else {
        throw err;
      }
    }
  }
}
