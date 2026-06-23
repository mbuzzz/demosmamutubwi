import { createContext, useContext, useState, type ReactNode } from 'react';
import { type SesiUjian, MOCK_SESI_UJIAN, generateToken } from '../../types/cbt';

interface ExamContextType {
  sessions: SesiUjian[];
  addSession: (session: SesiUjian) => void;
  updateSession: (id: string, data: Partial<SesiUjian>) => void;
  deleteSession: (id: string) => void;
  regenToken: (id: string) => void;
  submitExam: (id: string, score: number) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export function ExamSessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<SesiUjian[]>(MOCK_SESI_UJIAN);

  const addSession = (session: SesiUjian) => {
    setSessions(prev => [...prev, session]);
  };

  const updateSession = (id: string, data: Partial<SesiUjian>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const regenToken = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, token: generateToken() } : s));
  };

  const submitExam = (id: string, _score: number) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'Selesai' as const } : s));
  };

  return (
    <ExamContext.Provider value={{ sessions, addSession, updateSession, deleteSession, regenToken, submitExam }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExamSessions() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExamSessions must be used within an ExamSessionProvider');
  }
  return context;
}
