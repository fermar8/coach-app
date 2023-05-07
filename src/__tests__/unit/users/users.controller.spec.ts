import { Test } from '@nestjs/testing';
import { UsersController } from '../../../modules/users/users.controller';
import { UsersService } from '../../../modules/users/users.service';
import { PrismaService } from '../../../modules/prisma/prisma.service';

import { createUserDto, createUserResponse } from '../../__fixtures__/users';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      jest
        .spyOn(usersService, 'createUser')
        .mockResolvedValue(createUserResponse);
      const result = await usersController.createUser(createUserDto);
      expect(result).toBe(createUserResponse);
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
