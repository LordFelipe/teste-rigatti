import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

export class AuthService {
  static async register(email: string, password: string, role: 'admin' | 'user', companyId: string): Promise<string> {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email já em uso');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, role, companyId });

    return this.generateToken(user);
  }

  static async login(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Credenciais inválidas');
    }

    return this.generateToken(user);
  }

  private static generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, companyId: user.companyId, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );
  }
}