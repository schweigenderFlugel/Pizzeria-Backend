import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';

import { AppModule } from '../../../../app.module';
import { CreateUserDto } from '../../../user/application/dto/create-user.dto';
import { AuthService } from '../../application/service/auth.service';
import { loadFixtures } from '../../../../../src/common/fixtures/loader';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    authService = app.get<AuthService>(AuthService);

    await app.init();

    await loadFixtures(app);
  });

  it('should be register an user (201)', async () => {
    const userRegister: CreateUserDto = {
      name: 'TEST_NAME',
      lastName: 'TEST_LASTNAME',
      email: 'TEST@email.com',
      password: 'TEST_PASSWORD',
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userRegister)
      .expect(HttpStatus.CREATED);
  });

  it('should be throw error "conflict: user already exist" (409)', async () => {
    const userRegister = {
      name: 'TEST_NAME',
      lastName: 'TEST_LASTNAME',
      email: 'TEST@email.com',
      password: 'TEST_PASSWORD',
    };

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userRegister)
      .expect(HttpStatus.CONFLICT);
  });

  it('Should return a user-type token after logging in.', async () => {
    const userLogin: CreateUserDto = {
      email: 'TEST@email.com',
      password: 'TEST_PASSWORD',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userLogin);
    const authResponse: { accessToken: string } = response.body;
    const token = await authService.decodeToken(authResponse.accessToken);
    expect(token).toMatchObject({ role: 'user' });
  });

  it('Should return a admin-type token after logging in.', async () => {
    const userLogin: CreateUserDto = {
      email: 'admin@email.com',
      password: '12345678',
    };

    const verifyMatchMock = jest
      .spyOn(authService, 'verifyMatch')
      .mockResolvedValue(true);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userLogin);
    const { accessToken } = response.body;
    const token = await authService.decodeToken(accessToken);
    expect(token).toMatchObject({ role: 'admin' });
    expect(verifyMatchMock).toBeCalledTimes(1);
    verifyMatchMock.mockRestore();
  });

  it('should be unauthorized try login with false email (401)', async () => {
    const userLogin: CreateUserDto = {
      email: 'TEST_false@email.com',
      password: 'TEST_PASSWORD',
    };

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(userLogin)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should be unauthorized try login with false password (401)', async () => {
    const userLogin: CreateUserDto = {
      email: 'TEST@email.com',
      password: 'TEST_PASSWORD_FALSE',
    };

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(userLogin)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  afterAll(async () => {
    await app.close();
  });
});
