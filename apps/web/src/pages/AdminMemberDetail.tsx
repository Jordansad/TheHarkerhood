import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Award, Clock, Flame, Trash2 } from 'lucide-react'
import { useAuth } from '@/lib/use-auth'
import { useApiGet } from '@/lib/use-api-get'
import { useToast } from '@/lib/use-toast'
import { api, ApiError } from '@/lib/api-client'
import { canViewAdmin } from '@/lib/can-view-admin'
import { ROLE_LABEL } from '@/lib/user-role'
import { TIER_COLOR } from '@/lib/tier'
import { ACTIVITY_LABEL } from '@/lib/activity-type'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { cn } from '@/lib/utils'
import type { AdminMemberDetailDTO, MemberFollowUpStatus } from '@hackerhood/types'

const STATUS_LABEL: Record<MemberFollowUpStatus, string> = {
  on_track: 'Suit le rythme',
  at_risk: 'À risque de décrochage',
  inactive: 'Inactif',
}

const STATUS_CLASS: Record<MemberFollowUpStatus, string> = {
  on_track: 'bg-success/10 text-success border-success/30',
  at_risk: 'bg-warning/10 text-warning border-warning/30',
  inactive: 'bg-danger/10 text-danger border-danger/30',
}

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

export function AdminMemberDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const isAdmin = canViewAdmin(user?.role)
  const { data, error, retry } = useApiGet<AdminMemberDetailDTO>(isAdmin && id ? `/api/admin/members/${id}` : null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!data) return
    const confirmed = window.confirm(
      `Supprimer définitivement le compte de ${data.displayName} ? Toute sa progression, ses badges et son historique seront perdus. Cette action est irréversible.`
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      await api.delete(`/api/admin/members/${data.id}`)
      toast.success(`Compte de ${data.displayName} supprimé.`)
      navigate('/admin/membres', { replace: true })
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Impossible de contacter le serveur.')
      setDeleting(false)
    }
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!data) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/membres" className="mb-2 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text">
          <ArrowLeft className="h-4 w-4" /> Retour aux membres
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{data.displayName}</h1>
            <p className="mt-1 text-sm text-text-muted">
              {ROLE_LABEL[data.role]} · {data.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={STATUS_CLASS[data.followUpStatus]}>{STATUS_LABEL[data.followUpStatus]}</Badge>
            {data.id !== user?.id && (
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="h-4 w-4" /> Supprimer le compte
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10', TIER_COLOR[data.tier])}>
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className={cn('text-lg font-bold', TIER_COLOR[data.tier])}>{data.tierLabel}</p>
            <p className="text-xs text-text-muted">{data.xp} XP · {data.xpToNextTier > 0 ? `${data.xpToNextTier} XP avant le palier suivant` : 'Palier maximum'}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold">{data.streakCount} j</p>
            <p className="text-xs text-text-muted">Streak actuel</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold">{data.daysSinceActivity === null ? '—' : `${data.daysSinceActivity} j`}</p>
            <p className="text-xs text-text-muted">Depuis la dernière activité</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Progression globale de la roadmap</h2>
          <span className="text-sm text-text-muted">
            {data.completedSkills}/{data.totalSkills} compétences · {data.progressPercent}%
          </span>
        </div>
        <ProgressBar value={data.progressPercent} />
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">Progression par phase</h2>
        <div className="space-y-4">
          {data.phaseProgress.map((p) => (
            <div key={p.phase}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{p.label}</span>
                <span className="text-text-muted">
                  {p.completed}/{p.total} terminées{p.inProgress > 0 ? ` · ${p.inProgress} en cours` : ''}
                </span>
              </div>
              <ProgressBar value={p.percent} />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Badges obtenus</h2>
          <div className="flex flex-wrap gap-2">
            {data.badges.map((b) => (
              <Badge key={b.slug} className="border-accent/30 bg-accent/10 text-accent">
                {b.icon} {b.title}
              </Badge>
            ))}
            {data.badges.length === 0 && <p className="text-sm text-text-muted">Aucun badge pour le moment.</p>}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">Activité récente</h2>
          <div className="space-y-2">
            {data.recentActivity.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="truncate text-sm">{ACTIVITY_LABEL[a.type]}</span>
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
    </div>
  )
}
