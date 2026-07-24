import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import { useAuth } from '@/lib/use-auth'
import { useApiGet } from '@/lib/use-api-get'
import { canViewAdmin } from '@/lib/can-view-admin'
import { ROLE_LABEL } from '@/lib/user-role'
import { TIER_COLOR } from '@/lib/tier'
import { PHASE_LABEL } from '@/lib/category'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { cn } from '@/lib/utils'
import type { AdminMemberListItemDTO, MemberFollowUpStatus } from '@hackerhood/types'

const STATUS_LABEL: Record<MemberFollowUpStatus, string> = {
  on_track: 'Actif',
  at_risk: 'À risque',
  inactive: 'Inactif',
}

const STATUS_CLASS: Record<MemberFollowUpStatus, string> = {
  on_track: 'bg-success/10 text-success border-success/30',
  at_risk: 'bg-warning/10 text-warning border-warning/30',
  inactive: 'bg-danger/10 text-danger border-danger/30',
}

export function AdminMembers() {
  const { user } = useAuth()
  const isAdmin = canViewAdmin(user?.role)
  const { data, error, retry } = useApiGet<{ members: AdminMemberListItemDTO[] }>(isAdmin ? '/api/admin/members' : null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    if (!q) return data.members
    return data.members.filter((m) => m.displayName.toLowerCase().includes(q))
  }, [data, query])

  if (!isAdmin) return <Navigate to="/dashboard" replace />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!data) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin" className="mb-2 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text">
          <ArrowLeft className="h-4 w-4" /> Retour au dashboard
        </Link>
        <h1 className="text-2xl font-bold">Membres</h1>
        <p className="mt-1 text-sm text-text-muted">Progression et suivi individuel de chaque étudiant.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un membre..."
          className="pl-9"
        />
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">Membre</th>
              <th className="px-4 py-3 font-medium">Palier</th>
              <th className="px-4 py-3 font-medium">Phase actuelle</th>
              <th className="px-4 py-3 font-medium">Progression</th>
              <th className="px-4 py-3 font-medium">Dernière activité</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                <td className="px-4 py-3">
                  <Link to={`/admin/membres/${m.id}`} className="block">
                    <p className="font-medium">{m.displayName}</p>
                    <p className="text-xs text-text-muted">{ROLE_LABEL[m.role]}</p>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs font-semibold', TIER_COLOR[m.tier])}>{m.tierLabel}</span>
                  <p className="text-xs text-text-muted">{m.xp} XP</p>
                </td>
                <td className="px-4 py-3 text-xs text-text-muted">
                  {m.currentPhase ? PHASE_LABEL[m.currentPhase] : 'Roadmap terminée'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={m.progressPercent} className="w-24" />
                    <span className="shrink-0 text-xs text-text-muted">
                      {m.completedSkills}/{m.totalSkills}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-text-muted">
                  {m.daysSinceActivity === null ? '—' : `il y a ${m.daysSinceActivity} j`}
                </td>
                <td className="px-4 py-3">
                  <Badge className={STATUS_CLASS[m.followUpStatus]}>{STATUS_LABEL[m.followUpStatus]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-center text-sm text-text-muted">Aucun membre trouvé.</p>}
      </Card>
    </div>
  )
}
