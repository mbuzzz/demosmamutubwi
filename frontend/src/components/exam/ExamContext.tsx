import { createContext, useContext, useState, type ReactNode } from 'react';
import { type SesiUjian, generateToken } from '../../types/cbt';

interface ExamContextType {
  sessions: SesiUjian[];
  addSession: (session: SesiUjian) => void;
  updateSession: (id: number, data: Partial<SesiUjian>) => void;
  deleteSession: (id: number) => void;
  regenToken: (id: number) => void;
  submitExam: (id: number, score: number) => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export function ExamSessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<SesiUjian[]>([]);

  const addSession = (session: SesiUjian) => {
    setSessions(prev => [...prev, session]);
  };

  const updateSession = (id: number, data: Partial<SesiUjian>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteSession = (id: number) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const regenToken = (id: number) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, token: generateToken() } : s));
  };

  const submitExam = (id: number, _score: number) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'completed' as const } : s));
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
