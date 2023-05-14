import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { CreateUserDto, UserDto } from '../../domain/users/dto';
import { UserEntity } from '../../domain/users/entities';
import UsersModuleErrorMessages from '../../errorHandling/users/errorMessages';
import { FastifyReply } from 'fastify';
import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User Created.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: UsersModuleErrorMessages.USER_ALREADY_EXISTS,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: UsersModuleErrorMessages.USER_CREATE_ERROR,
  })
  async createUser(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() body: CreateUserDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.usersService.createUser(body);
    const cookie = await this.authService.createJwtToken(user);
    response.header('Set-Cookie', cookie);
    return user;
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User Logged In.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: UsersModuleErrorMessages.USER_INVALID_CREDENTIALS,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: UsersModuleErrorMessages.USER_REPOSITORY_ERROR,
  })
  async loginUser(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() body: UserDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.usersService.loginUser(body);
    const cookie = await this.authService.createJwtToken(user);
    response.header('Set-Cookie', cookie);
    return user;
  }
}
