import { Test } from '@nestjs/testing';
import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as path from 'path';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  UsersController,
  UsersService,
  UsersRepository,
} from '../../../modules/users';
import PrismaErrorCodes from '../../../errorHandling/prisma/errorCodes';

import {
  AcceptLanguageResolver,
  I18nModule,
  I18nService,
  CookieResolver,
} from 'nestjs-i18n';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { AuthService } from '../../../modules/auth/auth.service';
import { CommonService } from '../../../modules/common/common.service';
import { MailerService } from '../../../modules/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';

import {
  mockCreateUserDto,
  mockCreateUserResponse,
} from '../../__fixtures__/users';

import { TokenTypeEnum } from '../../../domain/auth/types';

describe('USERS SERVICE', () => {
  let usersService: UsersService;
  let usersRepository: DeepMocked<UsersRepository>;
  let authService: DeepMocked<AuthService>;
  let mailerService: DeepMocked<MailerService>;
  let i18nService: DeepMocked<I18nService>;
  let commonService: DeepMocked<CommonService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            type: 'json',
            path: path.join(__dirname, '../../../i18n/'),
            watch: true,
          },
          resolvers: [
            { use: CookieResolver, options: ['lang'] },
            AcceptLanguageResolver,
          ],
        }),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: UsersRepository,
          useValue: createMock<UsersRepository>(),
        },
        PrismaService,
        AuthService,
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
        {
          provide: CommonService,
          useValue: createMock<CommonService>(),
        },
        MailerService,
        {
          provide: MailerService,
          useValue: createMock<MailerService>(),
        },
        {
          provide: I18nService,
          useValue: createMock<I18nService>(),
        },
        CommonService,
        {
          provide: CommonService,
          useValue: createMock<CommonService>(),
        },
        JwtService,
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    authService = moduleRef.get(AuthService);
    mailerService = moduleRef.get(MailerService);
    commonService = moduleRef.get(CommonService);
    i18nService = moduleRef.get(I18nService);
    i18nService.translate = jest.fn().mockImplementation((key, options) => {
      // Check the key and options, and return a mock translation string
      if (key === 'email.confirmation_message') {
        return 'Mock translation for email.confirmation_message';
      }
      // Add other mock translations as needed
    });
    usersRepository = moduleRef.get(UsersRepository);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      authService.hashPassword.mockResolvedValue(mockCreateUserDto.password);
      usersRepository.createUser.mockResolvedValue(mockCreateUserResponse);
      authService.createJwtToken.mockResolvedValue('48383929484');
      mailerService.sendConfirmationEmail = jest.fn();
      i18nService.translate = jest.fn();

      await usersService.createUser(mockCreateUserDto, 'en');

      expect(authService.hashPassword).toHaveBeenCalledWith(
        mockCreateUserDto.password,
      );
      expect(usersRepository.createUser).toHaveBeenCalledWith({
        ...mockCreateUserDto,
        password: mockCreateUserDto.password,
      });
      expect(mailerService.sendConfirmationEmail).toHaveBeenCalled();
    });
    it('should fail with status 400 when user already exists', async () => {
      usersRepository.createUser.mockRejectedValue({
        code: PrismaErrorCodes.UNIQUE_CONSTRAINT_VIOLATION,
        message: 'Prisma Unique Constraint',
      });

      await expect(
        usersService.createUser(mockCreateUserDto, 'en'),
      ).rejects.toThrow(BadRequestException);
    });
    it('should fail with status 500 when any other error', async () => {
      usersRepository.createUser.mockRejectedValue({
        message: 'Any other error',
      });

      await expect(
        usersService.createUser(mockCreateUserDto, 'en'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('confirmEmail', () => {
    it('should return user, accessToken and refreshToken', async () => {
      authService.verifyToken.mockResolvedValue(1);
      usersRepository.getUserById.mockResolvedValue(mockCreateUserResponse);
      usersRepository.updateUserById.mockResolvedValue(mockCreateUserResponse);
      commonService.excludeFieldFromObject = jest
        .fn()
        .mockImplementation(() => {
          return mockCreateUserResponse;
        });
      authService.generateAuthTokens.mockResolvedValue([
        'anAccessToken',
        'aRefreshToken',
      ]);

      const result = await usersService.confirmEmail(
        { confirmationToken: 'aConfirmationToken' },
        'en',
      );

      expect(authService.verifyToken).toHaveBeenCalledWith(
        'aConfirmationToken',
        TokenTypeEnum.CONFIRMATION,
      );
      expect(usersRepository.getUserById).toHaveBeenCalledWith(1);
      expect(usersRepository.updateUserById).toHaveBeenCalledWith(
        1,
        mockCreateUserResponse,
      );
      expect(authService.generateAuthTokens).toHaveBeenCalledWith(
        mockCreateUserResponse,
      );
      expect(result).toEqual({
        user: mockCreateUserResponse,
        accessToken: 'anAccessToken',
        refreshToken: 'aRefreshToken',
      });
    });
    it('should fail with status 400 when email has already been confirmed', async () => {
      mockCreateUserResponse.isConfirmed = true;
      authService.verifyToken.mockResolvedValue(1);
      usersRepository.getUserById.mockResolvedValue(mockCreateUserResponse);

      await expect(
        usersService.confirmEmail(
          { confirmationToken: 'aConfirmationToken' },
          'en',
        ),
      ).rejects.toThrow(BadRequestException);
    });
    it('should fail with status 500 when any other error', async () => {
      authService.verifyToken.mockRejectedValue({
        message: 'Any other error',
      });

      await expect(
        usersService.confirmEmail(
          { confirmationToken: 'aConfirmationToken' },
          'en',
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
