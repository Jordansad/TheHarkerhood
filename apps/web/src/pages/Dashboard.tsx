import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Flame, Target, TrendingUp, Zap } from 'lucide-react'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/use-auth'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { FullPageSpinner } from '@/components/ui/Spinner'
import type { DashboardStatsDTO } from '@hackerhood/types'

export function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null)

  useEffect(() => {
    api.get<{ stats: DashboardStatsDTO }>('/api/dashboard/stats').then((data) => setStats(data.stats))
  }, [])

  if (!stats) return <FullPageSpinner />

  // Level N requires N*100 XP (must match apps/api/src/lib/xp.ts).
  const xpForCurrentLevel = stats.level * 100
  const xpIntoLevel = xpForCurrentLevel - stats.xpToNextLevel
  const levelProgressPercent = Math.round((xpIntoLevel / xpForCurrentLevel) * 100)

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
            <Zap className="h-4 w-4" />
            <span className="text-xs font-medium">Niveau</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{stats.level}</p>
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
          <span className="font-medium">Niveau {stats.level}</span>
          <span className="text-text-muted">{stats.xpToNextLevel} XP avant le niveau {stats.level + 1}</span>
        </div>
        <ProgressBar value={Math.max(0, Math.min(100, levelProgressPercent))} />
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
