import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';

describe('AuthController (e2e)', () => {
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

  describe('POST auth/invite (e2e)', () => {
    it('SUCCESS - Should generate invite token and save it to Db, then send by email an invite link and the token for a Coach', async () => {
      const response = await request(app.getHttpServer());
    });
    it('SUCCESS - Should generate invite token and save it to Db, then send by email an invite link and the token for a Player', async () => {
      const response = await request(app.getHttpServer());
    });
    it('FAIL - Should return status 403 if request does not include a valid token', async () => {
      const response = await request(app.getHttpServer());
    });
    it('FAIL - Should return status 403 when generating Coach invite if user role is not Admin', async () => {
      const response = await request(app.getHttpServer());
    });
    it('FAIL - Should return status 403 when generating Player invite if user role is not Coach', async () => {
      const response = await request(app.getHttpServer());
    });
  });
});
