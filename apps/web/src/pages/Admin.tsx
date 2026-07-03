import { Navigate } from 'react-router-dom'
import { ShieldAlert, TrendingUp, Users, Clock } from 'lucide-react'
import { useAuth } from '@/lib/use-auth'
import { useApiGet } from '@/lib/use-api-get'
import { canViewAdmin } from '@/lib/can-view-admin'
import { ROLE_LABEL } from '@/lib/user-role'
import { TIER_COLOR } from '@/lib/tier'
import { ACTIVITY_LABEL } from '@/lib/activity-type'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { cn } from '@/lib/utils'
import type { AdminOverviewDTO } from '@hackerhood/types'

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.floor(hours / 24)
  return `il y a ${days} j`
}

export function Admin() {
  const { user } = useAuth()
  const isAdmin = canViewAdmin(user?.role)
  const { data, error, retry } = useApiGet<AdminOverviewDTO>(isAdmin ? '/api/admin/overview' : null)

  if (!isAdmin) return <Navigate to="/dashboard" replace />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!data) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard fondateur</h1>
        <p className="mt-1 text-sm text-text-muted">Vue d'ensemble de l'activité de la communauté.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{data.totalMembers}</p>
            <p className="text-xs text-text-muted">Membres</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{data.recentActivity.length}</p>
            <p className="text-xs text-text-muted">Activités récentes</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{data.inactiveMembers.length}</p>
            <p className="text-xs text-text-muted">Membres inactifs (14j+)</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold">Répartition par palier</h2>
        <div className="flex flex-wrap gap-2">
          {data.tierBreakdown.map((t) => (
            <Badge key={t.tier} className={TIER_COLOR[t.tier]}>
              {t.label} · {t.count}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Top membres</h2>
          <div className="space-y-2">
            {data.topMembers.map((m, i) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono text-text-muted">#{i + 1}</span>
                  <span className="truncate text-sm font-medium">{m.displayName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn('text-xs font-semibold', TIER_COLOR[m.tier])}>{m.tierLabel}</span>
                  <span className="text-xs text-text-muted">{m.xp} XP</span>
                </div>
              </div>
            ))}
            {data.topMembers.length === 0 && <p className="text-sm text-text-muted">Aucun membre pour le moment.</p>}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <Clock className="h-4 w-4 text-danger" /> Membres inactifs
          </h2>
          <div className="space-y-2">
            {data.inactiveMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.displayName}</p>
                  <p className="text-xs text-text-muted">{ROLE_LABEL[m.role]}</p>
                </div>
                <span className="shrink-0 text-xs text-danger">{m.daysSinceActivity} j sans activité</span>
              </div>
            ))}
            {data.inactiveMembers.length === 0 && <p className="text-sm text-text-muted">Tout le monde est actif, bravo.</p>}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold">Activité récente de l'équipe</h2>
        <div className="space-y-2">
          {data.recentActivity.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm">
                  <span className="font-medium">{a.displayName}</span> — {ACTIVITY_LABEL[a.type]}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-accent">+{a.points} XP</span>
                <span className="text-xs text-text-muted">{timeAgo(a.createdAt)}</span>
              </div>
            </div>
          ))}
          {data.recentActivity.length === 0 && <p className="text-sm text-text-muted">Aucune activité loggée pour le moment.</p>}
        </div>
      </Card>
    </div>
  )
}
