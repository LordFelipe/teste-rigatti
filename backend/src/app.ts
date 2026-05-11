import cors from 'cors';
import express, { Application } from 'express';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import productRoutes from './routes/product.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);

export default app;