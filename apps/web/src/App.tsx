import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth-context'
import { useAuth } from '@/lib/use-auth'
import { ToastProvider } from '@/lib/toast-context'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Dashboard } from '@/pages/Dashboard'
import { Roadmap } from '@/pages/Roadmap'
import { SkillDetail } from '@/pages/SkillDetail'
import { SkillTheoryEditor } from '@/pages/SkillTheoryEditor'
import { Methodologies } from '@/pages/Methodologies'
import { MethodologyDetail } from '@/pages/MethodologyDetail'
import { Activities } from '@/pages/Activities'
import { Journal } from '@/pages/Journal'
import { JournalEditor } from '@/pages/JournalEditor'
import { Wiki } from '@/pages/Wiki'
import { WikiEditor } from '@/pages/WikiEditor'
import { Ctf } from '@/pages/Ctf'
import { CtfCategoryDetail } from '@/pages/CtfCategoryDetail'
import { Certifications } from '@/pages/Certifications'
import { Team } from '@/pages/Team'
import { Quiz } from '@/pages/Quiz'
import { QuizTake } from '@/pages/QuizTake'
import { QuizEditor } from '@/pages/QuizEditor'
import { Mentor } from '@/pages/Mentor'
import { Charte } from '@/pages/Charte'
import { Admin } from '@/pages/Admin'

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnly><Home /></PublicOnly>} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/roadmap/:slug/cours" element={<SkillTheoryEditor />} />
        <Route path="/roadmap/:slug" element={<SkillDetail />} />
        <Route path="/methodologies" element={<Methodologies />} />
        <Route path="/methodologies/:slug" element={<MethodologyDetail />} />
        <Route path="/activites" element={<Activities />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<JournalEditor />} />
        <Route path="/wiki" element={<Wiki />} />
        <Route path="/wiki/:slug" element={<WikiEditor />} />
        <Route path="/ctf" element={<Ctf />} />
        <Route path="/ctf/:slug" element={<CtfCategoryDetail />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/equipe" element={<Team />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:id/editer" element={<QuizEditor />} />
        <Route path="/quiz/:id" element={<QuizTake />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/charte" element={<Charte />} />
        <Route path="/admin" element={<Admin />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
