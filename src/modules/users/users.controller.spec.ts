import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { CreateUserBody } from '../../domain/users';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('createUser', () => {
    it('should create user successfully and return 201', async () => {
      /*
      const result = ['test'];
      jest.spyOn(usersService, 'createUser').mockImplementation(() => result);

      expect(await usersController.createUser()).toBe(result);
      */
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
