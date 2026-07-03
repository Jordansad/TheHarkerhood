import { Link } from 'react-router-dom'
import { CheckCircle2, CircleDashed, CircleDot, Lock } from 'lucide-react'
import { useApiGet } from '@/lib/use-api-get'
import { CATEGORY_LABEL, PHASE_LABEL, PHASE_ORDER } from '@/lib/category'
import { Card } from '@/components/ui/Card'
import { DifficultyBadge, Badge } from '@/components/ui/Badge'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import type { SkillDTO } from '@hackerhood/types'

const STATUS_ICON = {
  completed: <CheckCircle2 className="h-4 w-4 text-success" />,
  in_progress: <CircleDot className="h-4 w-4 text-info" />,
  not_started: <CircleDashed className="h-4 w-4 text-text-muted" />,
}

export function Roadmap() {
  const { data, error, retry } = useApiGet<{ skills: SkillDTO[] }>('/api/skills')

  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!data) return <FullPageSpinner />
  const skills = data.skills

  const completedIds = new Set(skills.filter((s) => s.progress === 'completed').map((s) => s.id))
  const grouped = skills.reduce<Record<string, SkillDTO[]>>((acc, skill) => {
    ;(acc[skill.phase] ??= []).push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Roadmap — 12 mois</h1>
        <p className="mt-1 text-sm text-text-muted">Ton parcours du débutant au Red Teamer confirmé, tel que défini par le programme The Hackerhood.</p>
      </div>

      {PHASE_ORDER.filter((phase) => grouped[phase]?.length).map((phase) => (
        <div key={phase}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">{PHASE_LABEL[phase]}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[phase].map((skill) => {
              const locked = skill.prerequisiteIds.length > 0 && !skill.prerequisiteIds.every((id) => completedIds.has(id))
              return (
                <Link key={skill.id} to={locked ? '#' : `/roadmap/${skill.slug}`} aria-disabled={locked}>
                  <Card className={locked ? 'opacity-50' : 'transition-colors hover:border-accent/40'}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-snug">{skill.title}</h3>
                      {locked ? <Lock className="h-4 w-4 shrink-0 text-text-muted" /> : STATUS_ICON[skill.progress]}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{skill.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <DifficultyBadge difficulty={skill.difficulty} />
                      <Badge>{CATEGORY_LABEL[skill.category]}</Badge>
                      <span className="text-xs text-text-muted">{skill.estimatedHours}h</span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
