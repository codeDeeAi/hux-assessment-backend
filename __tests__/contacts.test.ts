import request from 'supertest';
import { server } from '../server';
import { faker } from '@faker-js/faker';
import { password } from './auth.test';

const app = server;

describe('Contacts Endpoints', () => {

    let authToken = '';
    const phone = () => '070' + faker.datatype.number({ max: 99999999 }).toString();

    const register = async (email: string) => await request(app)
        .post('/api/v1/register')
        .send({
            email: email,
            password: password,
            name: faker.person.fullName()
        });

    const create = async () => await request(app)
        .post('/api/v1/contact')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            phone_number: phone()
        });

    beforeAll(async () => {
        const email = faker.internet.email();

        const res = await register(email);

        authToken = (await request(app)
            .post('/api/v1/login')
            .send({
                email,
                password
            })).body.data.token;
    });

    it('should create a new contact', async () => {
        const response = await create();

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('_id');
    });

    it('should list all contacts', async () => {
        const response = await request(app)
            .get('/api/v1/contacts')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should show a contact', async () => {
        const createResponse = await create();

        const contactId = createResponse.body.data._id;

        const response = await request(app)
            .get(`/api/v1/contact/${contactId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('_id', contactId);
    });

    it('should update a contact', async () => {
        const createResponse = await create();

        const contactId = createResponse.body.data._id;

        const response = await request(app)
            .patch(`/api/v1/contact/${contactId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                phone_number: phone()
            });

        expect(response.status).toBe(200);
    });

    it('should delete a contact', async () => {
        const createResponse = await create();

        const contactId = createResponse.body.data._id;

        const response = await request(app)
            .delete(`/api/v1/contact/${contactId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
    });

});
