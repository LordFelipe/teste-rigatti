import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import { clearTestDB, closeTestDB, connectTestDB } from './setup';

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Integração - Auth API', () => {
  it('Deve registrar um novo usuário e retornar um token JWT', async () => {
    const validObjectId = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app).post('/api/auth/register').send({
      email: 'admin@test.com',
      password: 'senhaforte123',
      role: 'admin',
      companyId: validObjectId
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.split('.').length).toBe(3); 
  });

  it('Não deve permitir registro com email duplicado', async () => {
    const validObjectId = new mongoose.Types.ObjectId().toHexString();
    const payload = {
      email: 'duplicado@test.com',
      password: '123',
      role: 'user',
      companyId: validObjectId
    };

    await request(app).post('/api/auth/register').send(payload);
    const response = await request(app).post('/api/auth/register').send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email já em uso');
  });
});