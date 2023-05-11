import { Test } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

import { AuthService } from '../../../modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

import {
  mockCreateUserDto,
  mockCreateUserResponse,
} from '../../__fixtures__/users';
import { AuthController } from '../../../modules/auth/auth.controller';
import { UserEntity } from '../../../domain/users/entities';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: DeepMocked<JwtService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
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
      const accessToken = 'anAccessToken';
      jwtService.signAsync.mockResolvedValue(accessToken);
      const result = await authService.createJwtToken(mockCreateUserResponse);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockCreateUserResponse.id, name: mockCreateUserResponse.name },
        { expiresIn: '7d', secret: process.env.SESSION_KEY },
      );
      expect(result).toEqual(
        `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_MAX_AGE}`,
      );
    });
  });
});
