import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, CircleDashed, CircleDot, Lock } from 'lucide-react'
import { api } from '@/lib/api-client'
import { CATEGORY_LABEL } from '@/lib/category'
import { Card } from '@/components/ui/Card'
import { DifficultyBadge } from '@/components/ui/Badge'
import { FullPageSpinner } from '@/components/ui/Spinner'
import type { SkillDTO } from '@cyberpath/types'

const STATUS_ICON = {
  completed: <CheckCircle2 className="h-4 w-4 text-accent" />,
  in_progress: <CircleDot className="h-4 w-4 text-info" />,
  not_started: <CircleDashed className="h-4 w-4 text-text-muted" />,
}

export function Roadmap() {
  const [skills, setSkills] = useState<SkillDTO[] | null>(null)

  useEffect(() => {
    api.get<{ skills: SkillDTO[] }>('/api/skills').then((data) => setSkills(data.skills))
  }, [])

  if (!skills) return <FullPageSpinner />

  const completedIds = new Set(skills.filter((s) => s.progress === 'completed').map((s) => s.id))
  const grouped = skills.reduce<Record<string, SkillDTO[]>>((acc, skill) => {
    ;(acc[skill.category] ??= []).push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Roadmap</h1>
        <p className="mt-1 text-sm text-text-muted">Ton parcours du débutant au Red Teamer confirmé.</p>
      </div>

      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
            {CATEGORY_LABEL[category as keyof typeof CATEGORY_LABEL] ?? category}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categorySkills.map((skill) => {
              const locked = skill.prerequisiteIds.length > 0 && !skill.prerequisiteIds.every((id) => completedIds.has(id))
              return (
                <Link key={skill.id} to={locked ? '#' : `/roadmap/${skill.slug}`} aria-disabled={locked}>
                  <Card className={locked ? 'opacity-50' : 'transition-colors hover:border-accent/40'}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-snug">{skill.title}</h3>
                      {locked ? <Lock className="h-4 w-4 shrink-0 text-text-muted" /> : STATUS_ICON[skill.progress]}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{skill.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <DifficultyBadge difficulty={skill.difficulty} />
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
