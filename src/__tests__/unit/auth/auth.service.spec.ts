import { Test } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import * as path from 'path';

import { AuthService } from '../../../modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from '../../../modules/common/common.service';

import { TokenTypeEnum } from '../../../domain/auth/types';

import {
  mockCreateUserDto,
  mockCreateUserResponse,
} from '../../__fixtures__/users';

import {
  AcceptLanguageResolver,
  I18nModule,
  I18nService,
  CookieResolver,
} from 'nestjs-i18n';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: DeepMocked<JwtService>;
  const accessToken = 'anAccessToken';

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
      providers: [
        AuthService,
        JwtService,
        CommonService,
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get(JwtService);
  });

  describe('createJwtToken', () => {
    it('should create a jwt token', async () => {
      jwtService.signAsync.mockResolvedValue(accessToken);
      const result = await authService.createJwtToken(
        mockCreateUserResponse,
        TokenTypeEnum.ACCESS,
      );

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: mockCreateUserResponse.id, name: mockCreateUserResponse.name },
        {
          expiresIn: process.env.JWT_ACCESS_TIME,
          secret: process.env.COOKIE_SECRET,
        },
      );
      expect(result).toEqual(accessToken);
    });
  });
});
