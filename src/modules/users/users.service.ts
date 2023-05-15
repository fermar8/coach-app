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
      this.mailerService.sendConfirmationEmail(user, confirmationToken);
      const confirmationEmailMessage: string = i18n.t(
        'users.confirmationEmailMessage',
      );
      return this.commonService.generateMessage(confirmationEmailMessage);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw new BadRequestException(
          i18n.t('users.userAlreadyExists'),
          err.message,
        );
      } else {
        throw new InternalServerErrorException(
          i18n.t('users.userUnexpectedError'),
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
}
