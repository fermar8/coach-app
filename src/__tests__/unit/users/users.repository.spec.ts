import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { UsersRepository } from '../../../modules/users';
import {
  mockCreateUserDto,
  mockCreateUserResponse,
} from '../../__fixtures__/users';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('USERS REPOSITORY', () => {
  let usersRepository: UsersRepository;
  let prismaClientMock: any;

  beforeEach(async () => {
    prismaClientMock = {
      user: {
        create: jest.fn().mockResolvedValue(mockCreateUserResponse),
        findUnique: jest.fn().mockResolvedValue(mockCreateUserResponse),
        update: jest.fn().mockResolvedValue(mockCreateUserResponse),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: prismaClientMock,
        },
      ],
    }).compile();

    usersRepository = moduleRef.get(UsersRepository);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const result = await usersRepository.createUser(mockCreateUserDto);
      expect(result).toBe(mockCreateUserResponse);
    });
  });
  describe('getUserById', () => {
    it('should return a user when given an id', async () => {
      const result = await usersRepository.getUserById(1);
      expect(result).toBe(mockCreateUserResponse);
    });
    it('should throw 401 when user is not found ', async () => {
      prismaClientMock.user.findUnique.mockResolvedValueOnce(undefined);
      await expect(usersRepository.getUserById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  // .mockRejectedValueOnce(new Error('Internal Server Error')),
  describe('getUserByEmail', () => {
    it('should return a user when given an email', async () => {
      const result = await usersRepository.getUserByEmail(
        mockCreateUserDto.email,
      );
      expect(result).toBe(mockCreateUserResponse);
    });
    it('should throw 401 when user is not found ', async () => {
      prismaClientMock.user.findUnique.mockResolvedValueOnce(undefined);
      await expect(
        usersRepository.getUserByEmail(mockCreateUserDto.email),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('updateUserById', () => {
    it('should return an updated user when given an id and userDto', async () => {
      const result = await usersRepository.updateUserById(
        1,
        mockCreateUserResponse,
      );
      expect(result).toBe(mockCreateUserResponse);
    });
  });
});
