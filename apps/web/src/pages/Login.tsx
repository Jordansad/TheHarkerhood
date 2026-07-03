import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/use-auth'
import { ApiError } from '@/lib/api-client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/ui/Logo'
import { LogoWatermark } from '@/components/ui/LogoWatermark'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur de connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4">
      <LogoWatermark className="left-1/2 top-1/2 h-[140vh] w-[140vh] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Logo size={36} />
          <span className="font-mono text-lg font-bold tracking-wide">THE HACKERHOOD</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <h1 className="text-lg font-semibold">Connexion</h1>

          {error && <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Mot de passe</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>

          <p className="text-center text-sm text-text-muted">
            Pas encore de compte ? <Link to="/register" className="text-accent hover:underline">Créer un compte</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
