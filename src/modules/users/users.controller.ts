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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IMessage } from 'src/domain/common/interfaces';
import { I18n, I18nContext } from 'nestjs-i18n';

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
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'User Created.',
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: UsersModuleErrorMessages.USER_ALREADY_EXISTS,
  })
  @ApiInternalServerErrorResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: UsersModuleErrorMessages.USER_CREATE_ERROR,
  })
  async createUser(
    @I18n() i18n: I18nContext,
    @Body() createUserDto: CreateUserDto,
  ): Promise<IMessage> {
    return await this.usersService.createUser(i18n, createUserDto);
  }

  /*

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'User Logged In.' })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: UsersModuleErrorMessages.USER_INVALID_CREDENTIALS,
  })
  @ApiInternalServerErrorResponse({
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
  */
}
