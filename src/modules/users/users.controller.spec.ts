import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto } from '../../domain/users/dto';
import { User } from '@prisma/client';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const createUserDto: CreateUserDto = {
    name: 'John',
    surname: 'Doe',
    email: 'anemail@example.com',
    phone: '555-555-5555',
    password: '123456789',
    userType: 'admin',
  };

  const user: User = {
    id: 1,
    name: createUserDto.name,
    surname: createUserDto.surname,
    email: createUserDto.email,
    phone: createUserDto.phone,
    password: createUserDto.password,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('createUser', () => {
    it('should create user successfully and return 201', async () => {
      jest.spyOn(usersService, 'createUser').mockResolvedValue(user);
      const result = await usersController.createUser(createUserDto);
      expect(result).toBe(user);
    });
    /*
    it('should return error 400 when there is missing data in body', async () => {});
    it('should return error 400 when email already exists', async () => {});
    it('should return error 500 when unexpected error', async () => {});
    */
  });

  describe('sendInvitation', () => {
    // it('', async () => {});
  });
});
