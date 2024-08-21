import request from 'supertest';
import { server } from '../server';
import { faker } from '@faker-js/faker';

const app = server;
export const password = '!Password123';

describe('Authentication Endpoints', () => {
  
  let authToken = '';
  const email = faker.internet.email();

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/register')
      .send({
        email: email,
        password: password,
        name: faker.person.fullName()
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('_id');
  });

  it('should login an existing user', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({
        email,
        password
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');

    authToken = response.body.data.token;
  });

  it('should log out a user', async () => {

    const response = await request(app)
      .get('/api/v1/logout')
      .set('Authorization', `Bearer ${authToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User logged out successfully');
  });

});
