import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api, getCsrfCookie } from '../../lib/api';
import { useRoleSimulator, type Role } from '../simulator/RoleContext';

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  roles?: string[] | null;
  /** Primary + additional roles (from backend append) */
  all_roles?: string[];
  nip_nisn?: string | null;
  uid_rfid?: string | null;
  kelas?: string | null;
  jabatan?: string | null;
  phone?: string | null;
  foto?: string | null;
  is_active?: boolean;
  siswa_id?: number | null;
  siswa?: any | null;
  penugasans?: Array<{
    id: number | string;
    mapel_id?: number;
    kelas_id?: number;
    total_jam?: number;
    mapel?: { id: number; nama: string; kode?: string } | null;
    kelas?: { id: number; nama: string } | null;
  }>;
}

/** Ambil semua role user (multi-role aware) */
export function getUserRoles(user: AuthUser | null | undefined): string[] {
  if (!user) return [];
  if (Array.isArray(user.all_roles) && user.all_roles.length > 0) {
    return user.all_roles;
  }
  const list = Array.isArray(user.roles) ? [...user.roles] : [];
  if (user.role && !list.includes(user.role)) {
    list.push(user.role);
  }
  return list;
}

export function userHasRole(user: AuthUser | null | undefined, allowed: string | string[]): boolean {
  const roles = getUserRoles(user);
  const list = Array.isArray(allowed) ? allowed : [allowed];
  return roles.some((r) => list.includes(r));
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
  const { setSimulatedRole } = useRoleSimulator();

  const applyUser = (data: AuthUser) => {
    setUser(data);
    setIsAuthenticated(true);
    // Set active role ke primary role user (bisa diganti via switcher multi-role)
    setSimulatedRole((data.role || 'siswa') as Role);
  };

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/user');
      if (res.data) {
        applyUser(res.data);
      }
    } catch {
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
      await getCsrfCookie();
      const res = await api.post('/login', { username, password });
      const authenticatedUser = res.data.user as AuthUser;
      applyUser(authenticatedUser);
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
      await getCsrfCookie();
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
