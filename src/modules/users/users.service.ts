import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { AuthService } from '../auth/auth.service';
import { CommonService } from '../common/common.service';
import { MailerService } from '../mailer/mailer.service';
import { UsersRepository } from './users.repository';
import { UserEntity } from '../../domain/users/entities';
import { CreateUserDto, UserDto } from '../../domain/users/dto';
import { IMessage } from '../../domain/common/interfaces';
import { TokenTypeEnum } from '../../domain/auth/types';
import { ConfirmEmailDto } from '../../domain/auth/dto';
import { IAuthResult } from '../../domain/auth/interfaces';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly commonService: CommonService,
  ) {}

  public async createUser(
    i18n: I18nContext,
    createUserDto: CreateUserDto,
  ): Promise<IMessage> {
    try {
      createUserDto.password = await this.authService.hashPassword(
        createUserDto.password,
      );
      const user: UserEntity = await this.usersRepository.createUser(
        createUserDto,
      );
      const confirmationToken: string = await this.authService.createJwtToken(
        user,
        TokenTypeEnum.CONFIRMATION,
      );
      this.mailerService.sendConfirmationEmail(user, confirmationToken, i18n);
      const confirmationEmailMessage: string = i18n.t(
        'email.confirmation_message',
      );
      return this.commonService.generateMessage(confirmationEmailMessage);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw new BadRequestException(
          i18n.t('users.error_already_exists'),
          err.message,
        );
      } else {
        throw new InternalServerErrorException(
          i18n.t('common.error_unexpected_error'),
          err.message,
        );
      }
    }
  }

  public async loginUser(
    userDto: UserDto,
  ): Promise<Omit<UserEntity, 'password'>> {
    try {
      const user = await this.usersRepository.getUserByEmail(userDto.email);
      const isPasswordValid = await this.authService.validateUserPassword(
        userDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException();
      }
      const userWithoutPassword = this.commonService.excludeFieldFromObject(
        user,
        ['password'],
      );
      return userWithoutPassword;
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof UnauthorizedException
      ) {
        throw new UnauthorizedException();
      } else {
        throw err;
      }
    }
  }

  public async confirmEmail(
    i18n: I18nContext,
    confirmEmailDto: ConfirmEmailDto,
  ): Promise<IAuthResult> {
    const { id } = await this.authService.verifyToken(
      confirmEmailDto.confirmationToken,
      TokenTypeEnum.CONFIRMATION,
    );
    const user = await this.usersRepository.getUserById(id);
    if (user.isConfirmed) {
      throw new BadRequestException(i18n.t('email.error_already_confirmed'));
    }
    user.isConfirmed = true;
    const updatedUser = await this.usersRepository.updateUserById(id, user);
    const [accessToken, refreshToken] =
      await this.authService.generateAuthTokens(user);
    return { user: updatedUser, accessToken, refreshToken };
  }
}
