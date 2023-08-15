import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { CommonService } from '../common/common.service';
import { CreateUserDto, UserDto } from '../../domain/users/dto';
import { ConfirmEmailDto } from '../../domain/auth/dto';
import { UserEntity } from '../../domain/users/entities';
import { IAuthResult } from '../../domain/auth/interfaces';
import UsersModuleErrorMessages from '../../errorHandling/users/errorMessages';
import CommonModuleErrorMessages from '../../errorHandling/common/errorMessages';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  Controller,
  Post,
  Body,
  Res,
  Req,
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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly commonService: CommonService,
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
    @Body() createUserDto: CreateUserDto,
    @Req() request: FastifyRequest,
  ): Promise<IMessage> {
    const locale = request.cookies['lang'] || 'en';
    return await this.usersService.createUser(createUserDto, locale);
  }

  @Post('/confirm-email')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Confirms the user email and returns the access token',
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: UsersModuleErrorMessages.USER_INVALID_TOKEN,
  })
  @ApiBadRequestResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: CommonModuleErrorMessages.COMMON_UNEXPECTED_ERROR,
  })
  async confirmEmail(
    @Body() confirmEmailDto: ConfirmEmailDto,
    @Res() res: FastifyReply,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    const locale: string = request.cookies['lang'] || 'en';
    const result: IAuthResult = await this.usersService.confirmEmail(
      confirmEmailDto,
      locale,
    );
    await this.authService.saveRfCookieAndSendUserAndAccessCookie(
      res,
      result,
      locale,
    );
  }

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
    description: UsersModuleErrorMessages.USER_UNEXPECTED_ERROR,
  })
  async loginUser(
    @Body() body: UserDto,
    @Res() res: FastifyReply,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    const locale: string = request.cookies['lang'] || 'en';
    const result: IAuthResult = await this.usersService.loginUser(body, locale);
    await this.authService.saveRfCookieAndSendUserAndAccessCookie(
      res,
      result,
      locale,
    );
  }
}
