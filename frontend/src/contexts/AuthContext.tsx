import { authApi } from '@/api/auth';
import type { DecodedToken, User } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'admin' | 'user', companyId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);


function decodeToken(token: string): User | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.exp * 1000 < Date.now()) return null;
    return { id: decoded.id, email: '', role: decoded.role, companyId: decoded.companyId };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('token');
    return stored ? decodeToken(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setUser(decodeToken(token));
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      setToken(data.token);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, role: 'admin' | 'user', companyId: string) => {
    setLoading(true);
    try {
      const { data } = await authApi.register(email, password, role, companyId);
      setToken(data.token);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAdmin: user?.role === 'admin',
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para acessar o contexto de auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
