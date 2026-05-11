import bcrypt from 'bcryptjs';
import console from 'console';
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import Product from '../models/product';
import User from '../models/user';

export const runSeed = async () => {
  // Tenta conectar apenas se não estiver conectado (evita loops em testes)
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  console.log('Limpando banco...');
  await User.deleteMany({});
  await Product.deleteMany({});

  const passwordHash = await bcrypt.hash('123456', 10);

  console.log('Criando Empresas (Admins)...');
  const companyA = await User.create({ email: 'admin@empresa-a.com', passwordHash, role: 'admin', companyId: new mongoose.Types.ObjectId() });
  const companyB = await User.create({ email: 'admin@empresa-b.com', passwordHash, role: 'admin', companyId: new mongoose.Types.ObjectId() });

  console.log('Criando Usuários (Clientes)...');
  await User.create({ email: 'user@empresa-a.com', passwordHash, role: 'user', companyId: companyA.companyId });
  await User.create({ email: 'user@empresa-b.com', passwordHash, role: 'user', companyId: companyB.companyId });

  console.log('Criando Produtos Empresa A...');
  const productsA = Array.from({ length: 10 }).map((_, i) => ({
    name: `Produto Eletrônico A${i}`,
    description: 'Descrição do eletrônico de alta qualidade.',
    price: 100 + (i * 10),
    category: 'Eletrônicos',
    companyId: companyA.companyId
  }));
  await Product.insertMany(productsA);

  console.log('Criando Produtos Empresa B...');
  const productsB = Array.from({ length: 10 }).map((_, i) => ({
    name: `Roupa B${i}`,
    description: 'Camiseta de algodão confortável.',
    price: 50 + (i * 5),
    category: 'Roupas',
    companyId: companyB.companyId
  }));
  await Product.insertMany(productsB);

  console.log('Seed finalizado com sucesso!');
};

if (!process.env.JEST_WORKER_ID) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
