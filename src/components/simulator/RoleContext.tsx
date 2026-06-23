import { createContext, useContext, useState, type ReactNode } from 'react';

type Role = 'superadmin' | 'guru' | 'walikelas' | 'siswa';

interface RoleContextType {
  simulatedRole: Role;
  setSimulatedRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [simulatedRole, setSimulatedRole] = useState<Role>('superadmin');

  return (
    <RoleContext.Provider value={{ simulatedRole, setSimulatedRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleSimulator() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoleSimulator must be used within a RoleProvider');
  }
  return context;
}
