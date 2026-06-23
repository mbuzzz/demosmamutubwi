import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import { RoleProvider } from './components/simulator/RoleContext.tsx'
import { AuthProvider } from './components/auth/AuthContext.tsx'
import { ExamSessionProvider } from './components/exam/ExamContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="sit-admin-theme">
      <RoleProvider>
        <AuthProvider>
          <ExamSessionProvider>
            <App />
          </ExamSessionProvider>
        </AuthProvider>
      </RoleProvider>
    </ThemeProvider>
  </StrictMode>,
)
