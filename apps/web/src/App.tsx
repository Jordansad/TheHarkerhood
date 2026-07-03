import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClipboardList, NotebookPen, BookOpen, Flag, Award, HelpCircle, Bot } from 'lucide-react'
import { AuthProvider } from '@/lib/auth-context'
import { useAuth } from '@/lib/use-auth'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { Roadmap } from '@/pages/Roadmap'
import { SkillDetail } from '@/pages/SkillDetail'
import { ComingSoon } from '@/pages/ComingSoon'

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/roadmap/:slug" element={<SkillDetail />} />
        <Route
          path="/methodologies"
          element={<ComingSoon title="Méthodologies" description="Guides pratiques de pentest web, interne, AD, WiFi, OSINT, CTF et bug bounty avec checklists." icon={ClipboardList} />}
        />
        <Route
          path="/journal"
          element={<ComingSoon title="Journal" description="Ton journal personnel : notes, writeups, commandes et découvertes, façon Obsidian." icon={NotebookPen} />}
        />
        <Route
          path="/wiki"
          element={<ComingSoon title="Wiki" description="Ta base de connaissances personnelle organisée par thème." icon={BookOpen} />}
        />
        <Route
          path="/ctf"
          element={<ComingSoon title="CTF" description="Méthodologie et ressources par catégorie : Web, Crypto, Forensics, Reverse, OSINT, Pwn, Stego, Mobile, Cloud." icon={Flag} />}
        />
        <Route
          path="/certifications"
          element={<ComingSoon title="Certifications" description="Catalogue de certifications et suivi de ta progression vers chacune d'elles." icon={Award} />}
        />
        <Route
          path="/quiz"
          element={<ComingSoon title="Quiz" description="QCM, flashcards et scénarios pour réviser ce que tu as appris." icon={HelpCircle} />}
        />
        <Route
          path="/mentor"
          element={<ComingSoon title="Mentor IA" description="Un assistant IA pour t'aider sur tes labs, expliquer des commandes et te guider dans ta pratique." icon={Bot} />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
