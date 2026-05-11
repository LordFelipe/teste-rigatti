import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  companyId: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  companyId: { type: Schema.Types.ObjectId, required: true, index: true }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);