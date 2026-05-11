import Product, { IProduct } from '../models/product';

export class ProductService {
  constructor(private readonly companyId: string) {}

  async create(data: Partial<IProduct>): Promise<IProduct> {
    return Product.create({ ...data, companyId: this.companyId });
  }

  async findAll(): Promise<IProduct[]> {
    return Product.find({ companyId: this.companyId });
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findOneAndUpdate({ _id: id, companyId: this.companyId }, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.deleteOne({ _id: id, companyId: this.companyId });
    return result.deletedCount === 1;
  }
}