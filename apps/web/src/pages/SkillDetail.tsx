import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, FlaskConical } from 'lucide-react'
import { api, ApiError } from '@/lib/api-client'
import { CATEGORY_LABEL } from '@/lib/category'
import { Card } from '@/components/ui/Card'
import { DifficultyBadge, Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { cn } from '@/lib/utils'
import type { SkillDTO, SkillProgressStatus } from '@hackerhood/types'

const STATUS_OPTIONS: { value: SkillProgressStatus; label: string }[] = [
  { value: 'not_started', label: 'Pas commencé' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminé' },
]

export function SkillDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [skill, setSkill] = useState<SkillDTO | null>(null)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    if (!slug) return
    setError(null)
    api
      .get<{ skill: SkillDTO }>(`/api/skills/${slug}`)
      .then((data) => setSkill(data.skill))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Impossible de contacter le serveur.'))
  }, [slug])

  useEffect(() => load(), [load])

  async function updateStatus(status: SkillProgressStatus) {
    if (!slug) return
    setUpdating(true)
    try {
      const data = await api.patch<{ skill: SkillDTO }>(`/api/skills/${slug}/progress`, { status })
      setSkill(data.skill)
    } finally {
      setUpdating(false)
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />
  if (!skill) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <Link to="/roadmap" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" /> Retour à la roadmap
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={skill.difficulty} />
          <Badge>{CATEGORY_LABEL[skill.category]}</Badge>
          <Badge>{skill.estimatedHours}h estimées</Badge>
        </div>
        <h1 className="mt-2 text-2xl font-bold">{skill.title}</h1>
        <p className="mt-2 text-text-muted">{skill.description}</p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-text-muted">Pourquoi c'est important</h2>
        <p className="mt-1.5 text-sm">{skill.importance}</p>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-text-muted">Progression</h2>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={skill.progress === opt.value ? 'primary' : 'secondary'}
              disabled={updating}
              onClick={() => updateStatus(opt.value)}
              className={cn(skill.progress === opt.value && 'pointer-events-none')}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </Card>

      {skill.resources.length > 0 && (
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-text-muted">Ressources recommandées</h2>
          <ul className="space-y-2">
            {skill.resources.map((r) => (
              <li key={r.id}>
                <a href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-accent hover:underline">
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" /> {r.title}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {skill.labs.length > 0 && (
        <Card>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-muted">
            <FlaskConical className="h-4 w-4" /> Labos recommandés
          </h2>
          <ul className="space-y-2">
            {skill.labs.map((lab) => (
              <li key={lab.id} className="flex items-center justify-between text-sm">
                <span>
                  {lab.title} <span className="text-text-muted">— {lab.platform}</span>
                </span>
                {lab.url && (
                  <a href={lab.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    Ouvrir
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
