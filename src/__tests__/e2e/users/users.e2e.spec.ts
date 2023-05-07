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
});
