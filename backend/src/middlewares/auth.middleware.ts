import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, companyId: string, role: 'admin' | 'user' };
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if ((req as any).user?.role !== 'admin') {
    res.status(403).json({ message: 'Acesso restrito a administradores.' });
    return;
  }
  next();
};