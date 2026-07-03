import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { LogoWatermark } from '@/components/ui/LogoWatermark'
import { Button } from '@/components/ui/Button'

export function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <LogoWatermark className="left-1/2 top-1/2 h-[140vh] w-[140vh] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <Logo size={120} className="mb-6 shadow-[0_0_60px_-10px_var(--color-accent)]" />
        <h1 className="font-mono text-3xl font-bold tracking-wide sm:text-4xl">THE HACKERHOOD</h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-accent">
          Learn · Practice · Share · Certify
        </p>
        <p className="mt-4 text-text-muted">
          Building skills. Earning certifications. Ton compagnon personnel d'apprentissage en cybersécurité —
          Red Team &amp; Blue Team.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link to="/register" className="flex-1">
            <Button className="w-full">Créer un compte</Button>
          </Link>
          <Link to="/login" className="flex-1">
            <Button variant="secondary" className="w-full">Se connecter</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
