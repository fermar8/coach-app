import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEntity } from '../../domain/users/entities';
import { FastifyReply } from 'fastify';
import { CreateUserDto } from '../../domain/users/dto';
import { AuthService } from '../auth/auth.service';
import UsersModuleErrorMessages from '../../errorHandling/users/errorMessages';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User Created.' })
  @ApiResponse({
    status: 400,
    description: UsersModuleErrorMessages.USER_ALREADY_EXISTS,
  })
  @ApiResponse({
    status: 500,
    description: UsersModuleErrorMessages.USER_CREATE_ERROR,
  })
  async createUser(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() body: CreateUserDto,
  ): Promise<UserEntity> {
    const user = await this.usersService.createUser(body);
    const cookie = await this.authService.createJwtToken(user);
    response.header('Set-Cookie', cookie);
    return user;
  }
}
