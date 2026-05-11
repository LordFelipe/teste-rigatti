import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Product from '../models/product';
import { AuthService } from '../services/auth.service';
import { clearTestDB, closeTestDB, connectTestDB } from './setup';

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Integração - Produtos API', () => {
  const generateToken = async (email: string, role: 'admin' | 'user', companyId: string) => {
    return AuthService.register(email, 'password123', role, companyId);
  };

  it('Deve criar um produto como Admin e não acessá-lo por outra empresa', async () => {
    const companyAId = new mongoose.Types.ObjectId().toHexString();
    const companyBId = new mongoose.Types.ObjectId().toHexString();
    
    const adminAToken = await generateToken('adminA@test.com', 'admin', companyAId);
    const userBToken = await generateToken('userB@test.com', 'user', companyBId);

    const createResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminAToken}`)
      .send({
        name: 'Notebook Gamer',
        description: 'Potente',
        price: 5000,
        category: 'Eletrônicos'
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('_id');
    expect(createResponse.body.companyId).toBe(companyAId);

    const listResponseB = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${userBToken}`);

    expect(listResponseB.status).toBe(200);
    expect(listResponseB.body).toHaveLength(0);

    const listResponseA = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${adminAToken}`);

    expect(listResponseA.body).toHaveLength(1);
    expect(listResponseA.body[0].name).toBe('Notebook Gamer');
  });

  it('Deve barrar criação de produto por role User', async () => {
    const companyId = new mongoose.Types.ObjectId().toHexString();
    const userToken = await generateToken('user@test.com', 'user', companyId);

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Camisa', description: 'Algodão', price: 50, category: 'Roupas' });

    expect(response.status).toBe(403); 
  });

  it('Deve atualizar e deletar um produto como Admin', async () => {
    const companyId = new mongoose.Types.ObjectId().toHexString();
    const token = await generateToken('admin@test.com', 'admin', companyId);

    const product = await Product.create({
      name: 'Mouse',
      description: 'Antigo',
      price: 20,
      category: 'Periféricos',
      companyId: companyId
    });

    const updResp = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 30 });

    expect(updResp.status).toBe(200);
    expect(updResp.body.price).toBe(30);

    const delResp = await request(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(delResp.status).toBe(204);

    const found = await Product.findById(product._id);
    expect(found).toBeNull();
  });
});
