import { clearTestDB, closeTestDB, connectTestDB } from './setup';
import User from '../models/user';
import Product from '../models/product';
import { runSeed } from '../scripts/dbSeed';

beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe('Seed de Banco de Dados', () => {
  it('Deve popular o banco com empresas e produtos corretamente', async () => {
    expect(await User.countDocuments()).toBe(0);
    expect(await Product.countDocuments()).toBe(0);

    await runSeed();

    const userCount = await User.countDocuments();
    expect(userCount).toBe(4);

    const productCount = await Product.countDocuments();
    expect(productCount).toBe(20);

    const adminA = await User.findOne({ email: 'admin@empresa-a.com' });
    const userA = await User.findOne({ email: 'user@empresa-a.com' });
    
    expect(adminA).not.toBeNull();
    expect(userA).not.toBeNull();
    expect(adminA?.companyId.toString()).toBe(userA?.companyId.toString());

    const productsA = await Product.find({ companyId: adminA?.companyId });
    expect(productsA.length).toBe(10);
  });
});
