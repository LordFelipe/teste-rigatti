import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  companyId: mongoose.Types.ObjectId;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  companyId: { type: Schema.Types.ObjectId, required: true, index: true }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);