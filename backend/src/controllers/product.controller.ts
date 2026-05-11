import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const service = new ProductService((req as any).user!.companyId);
      const product = await service.create(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const service = new ProductService((req as any).user!.companyId);
      const products = await service.findAll();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const service = new ProductService((req as any).user!.companyId);
      const product = await service.update(String(req.params.id), req.body);
      if (!product) { res.status(404).json({ message: 'Produto não encontrado' }); return; }
      res.status(200).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const service = new ProductService((req as any).user!.companyId);
      const success = await service.delete(String(req.params.id));
      if (!success) { res.status(404).json({ message: 'Produto não encontrado' }); return; }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}