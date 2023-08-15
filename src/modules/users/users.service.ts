import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
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
import PrismaErrorCodes from '../../errorHandling/prisma/errorCodes';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly commonService: CommonService,
    private readonly i18n: I18nService,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
    locale: string,
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
      this.mailerService.sendConfirmationEmail(user, confirmationToken, locale);
      const confirmationEmailMessage: string = this.i18n.translate(
        'email.confirmation_message',
        { lang: locale },
      );
      return this.commonService.generateMessage(confirmationEmailMessage);
    } catch (err) {
      if (err.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException(
          this.i18n.translate('users.error_already_exists', { lang: locale }),
          err.message,
        );
      } else {
        throw new InternalServerErrorException(
          this.i18n.translate('common.error_unexpected_error', {
            lang: locale,
          }),
          err.message,
        );
      }
    }
  }

  public async loginUser(
    userDto: UserDto,
    locale: string,
  ): Promise<IAuthResult> {
    try {
      const user: UserEntity = await this.usersRepository.getUserByEmail(
        userDto.email,
      );
      if (!user.isConfirmed) {
        throw new BadRequestException(
          this.i18n.translate('users.error_user_not_confirmed', {
            lang: locale,
          }),
        );
      }
      const isPasswordValid = await this.authService.validateUserPassword(
        userDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          this.i18n.translate('users.error_invalid_credentials', {
            lang: locale,
          }),
        );
      }
      const userWithoutPassword: Omit<UserEntity, keyof string[]> =
        this.commonService.excludeFieldFromObject(user, ['password']);

      const [accessToken, refreshToken] =
        await this.authService.generateAuthTokens(user);
      return { user: userWithoutPassword, accessToken, refreshToken };
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
    confirmEmailDto: ConfirmEmailDto,
    locale: string,
  ): Promise<IAuthResult> {
    try {
      const userId: number = await this.authService.verifyToken(
        confirmEmailDto.confirmationToken,
        TokenTypeEnum.CONFIRMATION,
      );
      const user: UserEntity = await this.usersRepository.getUserById(userId);
      if (user.isConfirmed) {
        throw new BadRequestException(
          this.i18n.translate('email.error_already_confirmed', {
            lang: locale,
          }),
        );
      }
      user.isConfirmed = true;
      const updatedUser: UserEntity = await this.usersRepository.updateUserById(
        userId,
        user,
      );
      const updatedUserWithoutPassword: Omit<UserEntity, keyof string[]> =
        this.commonService.excludeFieldFromObject(updatedUser, ['password']);
      const [accessToken, refreshToken] =
        await this.authService.generateAuthTokens(user);
      return { user: updatedUserWithoutPassword, accessToken, refreshToken };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      } else if (err instanceof NotFoundException) {
        throw new NotFoundException(
          this.i18n.translate('users.error_not_found', {
            lang: locale,
          }),
        );
      } else {
        throw new InternalServerErrorException(
          this.i18n.translate('email.error_while_confirming_email', {
            lang: locale,
          }),
        );
      }
    }
  }
}
