import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { UpdateProfileDto } from '../../application/dto/update-profile.dto';
import { TestService } from 'src/module/test/application/service/test.service';
import { tokens } from './../../../../../src/common/fixtures/user';
import { AuthService } from 'src/module/auth/application/service/auth.service';

describe('Profile', () => {
  let app: INestApplication;
  let testService: TestService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    testService = app.get<TestService>(TestService);
    authService = app.get<AuthService>(AuthService);
    await testService.loadDefault();
    await app.init();
  });

  describe('GET /profile', () => {
    it('Should get a profile by ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/profile')
        .auth(tokens.adminUserToken, { type: 'bearer' });
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body.user).toBeDefined();
    });

    it('Should get a profile by ID being user', async () => {
      const response = await request(app.getHttpServer())
        .get('/profile')
        .auth(tokens.normalUserToken, { type: 'bearer' });
      const token = await authService.decodeToken(tokens.normalUserToken);
      console.log(token);
      expect(token).toMatchObject({ profile: 2 });
    });

    it('Should get not found profile by ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/profile/999')
        .auth(tokens.adminUserToken, { type: 'bearer' });
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /profile', () => {
    it('Should modify profile being admin', async () => {
      const updateProfileDto: UpdateProfileDto = {
        age: 30,
      };
      const response = await request(app.getHttpServer())
        .put('/profile')
        .send(updateProfileDto)
        .auth(tokens.adminUserToken, { type: 'bearer' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('age', 30);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
