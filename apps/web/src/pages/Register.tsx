import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Terminal } from 'lucide-react'
import { useAuth } from '@/lib/use-auth'
import { ApiError } from '@/lib/api-client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(email, password, displayName)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur lors de la création du compte.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Terminal className="h-6 w-6 text-accent" />
          <span className="font-mono text-lg font-bold">cyberpath</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6">
          <h1 className="text-lg font-semibold">Créer un compte</h1>

          {error && <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Nom affiché</label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required autoFocus minLength={2} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Mot de passe</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <p className="text-xs text-text-muted">8 caractères minimum.</p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Création…' : 'Créer mon compte'}
          </Button>

          <p className="text-center text-sm text-text-muted">
            Déjà un compte ? <Link to="/login" className="text-accent hover:underline">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
