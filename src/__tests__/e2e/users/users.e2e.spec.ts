import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { createUserDto } from '../../__fixtures__/users';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Creation (e2e)', () => {
    it('SUCCESS - should create a new user with admin role', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(HttpStatus.CREATED);

      const createdUser = response.body;

      expect(createdUser).toHaveProperty('id');
      expect(createdUser.name).toBe(createUserDto.name);
      expect(createdUser.email).toBe(createUserDto.email);
      expect(createdUser.admin.role).toBe(createUserDto.role);
    });
    it('SUCCESS - should create a new user with coach role', async () => {
      createUserDto.role = 'coach';
      createUserDto.email = 'coach@example.com';
      createUserDto.phone = '2234567890';
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(HttpStatus.CREATED);

      const createdUser = response.body;

      expect(createdUser).toHaveProperty('id');
      expect(createdUser.name).toBe(createUserDto.name);
      expect(createdUser.email).toBe(createUserDto.email);
      expect(createdUser.coach.role).toBe(createUserDto.role);
    });
    it('SUCCESS - should create a new user with player role', async () => {
      createUserDto.role = 'player';
      createUserDto.email = 'player@example.com';
      createUserDto.phone = '3234567890';
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(HttpStatus.CREATED);

      const createdUser = response.body;

      expect(createdUser).toHaveProperty('id');
      expect(createdUser.name).toBe(createUserDto.name);
      expect(createdUser.email).toBe(createUserDto.email);
      expect(createdUser.player.role).toBe(createUserDto.role);
    });
    it('ERROR - should return an error if repeated email', async () => {
      createUserDto.role = 'player';
      createUserDto.email = 'player@example.com';
      createUserDto.phone = '5234567890';
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe('Invalid User Role');
    });
    it('ERROR - should return an error if invalid role', async () => {
      createUserDto.role = 'invalidRole';
      createUserDto.email = 'invalidRole@example.com';
      createUserDto.phone = '4234567890';
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe('Invalid User Role');
    });
  });
});
