import * as ai from 'ai';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Product from '../models/product';
import { AuthService } from '../services/auth.service';
import { clearTestDB, closeTestDB, connectTestDB } from './setup';


jest.mock('ai', () => {
  const originalModule = (jest as any).requireActual('ai');
  return {
    __esModule: true,
    ...originalModule,
    generateText: jest.fn(),
  };
});

jest.mock('@ai-sdk/groq', () => ({
  groq: jest.fn().mockReturnValue('mock-groq-model'),
}));

beforeAll(async () => await connectTestDB());
afterEach(async () => {
  await clearTestDB();
  jest.clearAllMocks();
});
afterAll(async () => await closeTestDB());

describe('Integração - Chat API com Tool Calling', () => {
  const generateToken = async (companyId: string) => {
    return AuthService.register(`test-${Date.now()}@test.com`, 'pwd123', 'user', companyId);
  };

  it('Deve executar a tool de busca no chat e retornar produtos da empresa correta', async () => {
    const companyA = new mongoose.Types.ObjectId().toHexString();
    const companyB = new mongoose.Types.ObjectId().toHexString();
    const userTokenA = await generateToken(companyA);

    await Product.create([
      { name: 'Monitor Gamer A', description: '144hz', price: 1000, category: 'Monitores', companyId: companyA },
      { name: 'Monitor Antigo B', description: '60hz', price: 500, category: 'Monitores', companyId: companyB },
    ]);

    (ai.generateText as jest.Mock).mockImplementation(async (options) => {
      const tool = options.tools.searchProducts;
      
      expect(tool).toBeDefined();
      
      const toolResults = await tool.execute({ query: 'Monitor' }, {} as any);

      expect(toolResults).toHaveLength(1);
      expect(toolResults[0].name).toBe('Monitor Gamer A');
      expect(toolResults[0].companyId).toBeUndefined(); 
      return { text: 'Encontrei o Monitor Gamer A por R$1000.' };
    });

    const response = await request(app)
      .post('/api/chat')
      .set('Authorization', `Bearer ${userTokenA}`)
      .send({ message: 'Qual monitor você tem?' });

    expect(response.status).toBe(200);
    expect(response.body.reply).toBe('Encontrei o Monitor Gamer A por R$1000.');
    expect(ai.generateText).toHaveBeenCalledTimes(1);
  });
});
