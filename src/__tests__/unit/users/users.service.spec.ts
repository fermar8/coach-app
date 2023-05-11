import { Test } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  UsersController,
  UsersService,
  UsersRepository,
} from '../../../modules/users';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { AuthService } from '../../../modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

import {
  mockCreateUserDto,
  mockCreateUserResponse,
} from '../../__fixtures__/users';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: DeepMocked<UsersRepository>;
  let authService: DeepMocked<AuthService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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
        JwtService,
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    authService = moduleRef.get(AuthService);
    usersRepository = moduleRef.get(UsersRepository);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      authService.hashPassword.mockResolvedValue(mockCreateUserDto.password);
      usersRepository.createUser.mockResolvedValue(mockCreateUserResponse);
      usersRepository.getUserById.mockResolvedValue(mockCreateUserResponse);

      const result = await usersService.createUser(mockCreateUserDto);

      expect(authService.hashPassword).toHaveBeenCalledWith(
        mockCreateUserDto.password,
      );
      expect(usersRepository.createUser).toHaveBeenCalledWith({
        ...mockCreateUserDto,
        password: mockCreateUserDto.password,
      });
      expect(usersRepository.getUserById).toHaveBeenCalledWith(
        mockCreateUserResponse.id,
      );
      expect(result).toEqual(mockCreateUserResponse);
    });
  });
});
