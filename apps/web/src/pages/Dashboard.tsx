import { Link } from 'react-router-dom'
import { ArrowRight, Flame, Target, TrendingUp, Trophy, NotebookPen } from 'lucide-react'
import { useAuth } from '@/lib/use-auth'
import { useApiGet } from '@/lib/use-api-get'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { TIER_COLOR, tierProgressPercent } from '@/lib/tier'
import { cn } from '@/lib/utils'
import type { DashboardStatsDTO } from '@hackerhood/types'

const PORTFOLIO_WRITEUP_GOAL = 10

export function Dashboard() {
  const { user } = useAuth()
  const { data, error, retry } = useApiGet<{ stats: DashboardStatsDTO }>('/api/dashboard/stats')

  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!data) return <FullPageSpinner />
  const stats = data.stats

  const tierPercent = Math.max(0, Math.min(100, tierProgressPercent(stats.xp, stats.tier)))
  const portfolioPercent = Math.min(100, Math.round((stats.writeupCount / PORTFOLIO_WRITEUP_GOAL) * 100))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Salut {user?.displayName} 👋</h1>
        <p className="mt-1 text-sm text-text-muted">Voici où tu en es dans ta progression.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-2 text-text-muted">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Progression globale</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{stats.progressPercent}%</p>
          <p className="text-xs text-text-muted">{stats.completedSkills}/{stats.totalSkills} compétences</p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-text-muted">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-medium">Palier</span>
          </div>
          <p className={cn('mt-2 text-3xl font-bold', TIER_COLOR[stats.tier])}>{stats.tierLabel}</p>
          <p className="text-xs text-text-muted">{stats.xp} XP au total</p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-text-muted">
            <Flame className="h-4 w-4" />
            <span className="text-xs font-medium">Streak</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{stats.streakCount}</p>
          <p className="text-xs text-text-muted">jour{stats.streakCount > 1 ? 's' : ''} d'affilée</p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-text-muted">
            <Target className="h-4 w-4" />
            <span className="text-xs font-medium">En cours</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{stats.inProgressSkills}</p>
          <p className="text-xs text-text-muted">compétence{stats.inProgressSkills > 1 ? 's' : ''} active{stats.inProgressSkills > 1 ? 's' : ''}</p>
        </Card>
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Progression globale de la roadmap</span>
          <span className="text-text-muted">{stats.completedSkills}/{stats.totalSkills}</span>
        </div>
        <ProgressBar value={stats.progressPercent} />
      </Card>

      <Card>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Palier {stats.tierLabel}</span>
          <span className="text-text-muted">
            {stats.xpToNextTier > 0 ? `${stats.xpToNextTier} XP avant le palier suivant` : 'Palier maximum atteint'}
          </span>
        </div>
        <ProgressBar value={tierPercent} />
        <Link to="/activites" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
          Déclarer une activité <ArrowRight className="h-3 w-3" />
        </Link>
      </Card>

      <Card>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <NotebookPen className="h-4 w-4 text-accent" /> Portfolio — Write-ups
        </div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-text-muted">{stats.writeupCount}/{PORTFOLIO_WRITEUP_GOAL} write-ups publiés</span>
          <span className="text-text-muted">{portfolioPercent}%</span>
        </div>
        <ProgressBar value={portfolioPercent} />
        <Link to="/journal" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
          Ouvrir le journal <ArrowRight className="h-3 w-3" />
        </Link>
      </Card>

      {stats.nextSuggestedSkill && (
        <Card className="border-accent/30 bg-accent/5">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Prochaine étape suggérée</p>
          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{stats.nextSuggestedSkill.title}</h3>
            <Link
              to={`/roadmap/${stats.nextSuggestedSkill.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              Commencer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
