import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api, getCsrfCookie } from '../../lib/api';

interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  nip_nisn?: string | null;
  uid_rfid?: string | null;
  kelas?: string | null;
  jabatan?: string | null;
  phone?: string | null;
  foto?: string | null;
  is_active?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/user');
      if (res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      // 1. Fetch CSRF cookie
      await getCsrfCookie();
      
      // 2. Perform login
      const res = await api.post('/login', { username, password });
      const authenticatedUser = res.data.user;
      
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      return authenticatedUser;
    } catch (err: any) {
      setUser(null);
      setIsAuthenticated(false);
      throw new Error(err.response?.data?.message || 'Gagal login. Periksa username dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout error on server:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
