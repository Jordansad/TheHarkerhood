import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/use-auth'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { AppLayout } from './AppLayout'

export function AuthGuard() {
  const { user, loading } = useAuth()

  if (loading) return <FullPageSpinner />
  if (!user) return <Navigate to="/login" replace />

  return <AppLayout />
}
