import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { mockCreateUserDto } from '../../__fixtures__/users';
import UsersModuleErrorMessages from '../../../errorHandling/users/errorMessages';

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

  describe('POST /users/register (e2e)', () => {
    it('SUCCESS - should create a new user with coach role', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(mockCreateUserDto)
        .set('Cookie', 'lang=en')
        .expect(HttpStatus.CREATED);

      expect(response.body.message).toBe(
        'Registration successful, check your email to confirm it',
      );
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('SUCCESS - should create a new user with player role', async () => {
      mockCreateUserDto.role = 'player';
      mockCreateUserDto.email = 'player@example.com';
      mockCreateUserDto.phone = '3234567890';
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(mockCreateUserDto)
        .set('Cookie', 'lang=en')
        .expect(HttpStatus.CREATED);

      expect(response.body.message).toBe(
        'Registration successful, check your email to confirm it',
      );
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('ERROR - should return an error if invalid body', async () => {
      const invalidBody = {
        invalidKey: 'invalidValue',
      };
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(invalidBody)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toStrictEqual([
        'name should not be empty',
        'surname should not be empty',
        'phone should not be empty',
        'role must be one of the following values: coach, player',
        'email must be an email',
        'password should not be empty',
      ]);
    });
    it('ERROR - should return an error if repeated email', async () => {
      mockCreateUserDto.role = 'player';
      mockCreateUserDto.email = 'player@example.com';
      mockCreateUserDto.phone = '5234567890';
      await request(app.getHttpServer())
        .post('/users/register')
        .set('Cookie', 'lang=en')
        .send(mockCreateUserDto);

      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(mockCreateUserDto)
        .set('Cookie', 'lang=en')
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual(
        UsersModuleErrorMessages.USER_ALREADY_EXISTS,
      );
    });
    it('ERROR - should return an error if invalid role', async () => {
      mockCreateUserDto.role = 'invalidRole';
      mockCreateUserDto.email = 'invalidRole@example.com';
      mockCreateUserDto.phone = '4234567890';
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(mockCreateUserDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toStrictEqual([
        'role must be one of the following values: coach, player',
      ]);
    });
  });
  // TODO: Use template to build tests for /users/confirm-email
  /*
  describe('POST /users/confirm-email (e2e)', () => {
    it('SUCCESS - should create a new user with coach role', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(mockCreateUserDto)
        .set('Cookie', 'lang=en')
        .expect(HttpStatus.CREATED);

      expect(response.body.message).toBe(
        'Registration successful, check your email to confirm it',
      );
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('SUCCESS - should create a new user with player role', async () => {
      mockCreateUserDto.role = 'player';
      mockCreateUserDto.email = 'player@example.com';
      mockCreateUserDto.phone = '3234567890';
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(mockCreateUserDto)
        .set('Cookie', 'lang=en')
        .expect(HttpStatus.CREATED);

      expect(response.body.message).toBe(
        'Registration successful, check your email to confirm it',
      );
      expect(response.status).toBe(HttpStatus.CREATED);
    });
    it('ERROR - should return an error if invalid body', async () => {
      const invalidBody = {
        invalidKey: 'invalidValue',
      };
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(invalidBody)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toStrictEqual([
        'name should not be empty',
        'surname should not be empty',
        'phone should not be empty',
        'role must be one of the following values: coach, player',
        'email must be an email',
        'password should not be empty',
      ]);
    });
    it('ERROR - should return an error if repeated email', async () => {
      mockCreateUserDto.role = 'player';
      mockCreateUserDto.email = 'player@example.com';
      mockCreateUserDto.phone = '5234567890';
      await request(app.getHttpServer())
        .post('/users/register')
        .set('Cookie', 'lang=en')
        .send(mockCreateUserDto);

      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(mockCreateUserDto)
        .set('Cookie', 'lang=en')
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toEqual(
        UsersModuleErrorMessages.USER_ALREADY_EXISTS,
      );
    });
    it('ERROR - should return an error if invalid role', async () => {
      mockCreateUserDto.role = 'invalidRole';
      mockCreateUserDto.email = 'invalidRole@example.com';
      mockCreateUserDto.phone = '4234567890';
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(mockCreateUserDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toStrictEqual([
        'role must be one of the following values: coach, player',
      ]);
    });
  });
  */
});
