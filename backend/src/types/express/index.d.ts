declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        companyId: string;
        role: 'admin' | 'user';
      };
    }
  }
}
export { };
