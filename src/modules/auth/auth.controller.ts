import { AuthService } from './auth.service';
import { UserDto } from '../../domain/users/dto';
import UsersModuleErrorMessages from '../../errorHandling/users/errorMessages';
import { FastifyReply } from 'fastify';
import {
  Controller,
  Post,
  Body,
  Query,
  Res,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
  @Post('/invite')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate invite user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User Logged In.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: UsersModuleErrorMessages.USER_INVALID_CREDENTIALS,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: UsersModuleErrorMessages.USER_REPOSITORY_ERROR,
  })
  async inviteUser(
    @Res({ passthrough: true }) response: FastifyReply,
    @Body() body: Omit<UserDto, 'password'>,
    @Query('teamId') teamId: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.usersService.loginUser(body);
    const cookie = await this.authService.createJwtToken(user);
    response.header('Set-Cookie', cookie);
    return user;
  }
  */
}
