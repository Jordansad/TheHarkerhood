import { Users } from 'lucide-react'
import { useApiGet } from '@/lib/use-api-get'
import { ROLE_LABEL } from '@/lib/user-role'
import { TIER_COLOR } from '@/lib/tier'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { cn } from '@/lib/utils'
import type { TeamMemberDTO } from '@hackerhood/types'

export function Team() {
  const { data, error, retry } = useApiGet<{ members: TeamMemberDTO[] }>('/api/team')

  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!data) return <FullPageSpinner />
  const members = data.members

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Équipe</h1>
        <p className="mt-1 text-sm text-text-muted">Les membres de la communauté The Hackerhood.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <Card key={m.id}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Users className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-semibold">{m.displayName}</h3>
                <p className="text-xs text-text-muted">{ROLE_LABEL[m.role]}</p>
              </div>
            </div>
            <Badge className={cn('mt-3', TIER_COLOR[m.tier])}>{m.tierLabel}</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}
