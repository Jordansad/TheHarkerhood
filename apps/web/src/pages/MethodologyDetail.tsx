import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckSquare, Square, ShieldAlert, ThumbsUp, PackageCheck, Wrench } from 'lucide-react'
import { api, ApiError } from '@/lib/api-client'
import { METHODOLOGY_CATEGORY_LABEL } from '@/lib/methodology-category'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { cn } from '@/lib/utils'
import type { MethodologyDTO } from '@hackerhood/types'

export function MethodologyDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [methodology, setMethodology] = useState<MethodologyDTO | null>(null)
  const [updatingStepId, setUpdatingStepId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    if (!slug) return
    setError(null)
    api
      .get<{ methodology: MethodologyDTO }>(`/api/methodologies/${slug}`)
      .then((data) => setMethodology(data.methodology))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Impossible de contacter le serveur.'))
  }, [slug])

  useEffect(() => load(), [load])

  async function toggleStep(stepId: string, checked: boolean) {
    if (!slug) return
    setUpdatingStepId(stepId)
    try {
      const data = await api.patch<{ methodology: MethodologyDTO }>(`/api/methodologies/${slug}/steps/${stepId}`, { checked })
      setMethodology(data.methodology)
    } finally {
      setUpdatingStepId(null)
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />
  if (!methodology) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <Link to="/methodologies" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" /> Retour aux méthodologies
      </Link>

      <div>
        <Badge>{METHODOLOGY_CATEGORY_LABEL[methodology.category]}</Badge>
        <h1 className="mt-2 text-2xl font-bold">{methodology.title}</h1>
        <p className="mt-2 text-text-muted">{methodology.objective}</p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-text-muted">Préparation</h2>
        <p className="mt-1.5 text-sm">{methodology.preparation}</p>
      </Card>

      <Card>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Wrench className="h-4 w-4" /> Outils
        </h2>
        <div className="flex flex-wrap gap-2">
          {methodology.tools.map((tool) => (
            <Badge key={tool}>{tool}</Badge>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-muted">Checklist</h2>
          <span className="text-xs text-text-muted">{methodology.progressPercent}%</span>
        </div>
        <ProgressBar value={methodology.progressPercent} className="mb-4" />
        <ul className="space-y-1">
          {methodology.steps.map((step) => (
            <li key={step.id}>
              <button
                onClick={() => toggleStep(step.id, !step.checked)}
                disabled={updatingStepId === step.id}
                className="flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-surface-hover disabled:opacity-50"
              >
                {step.checked ? (
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                ) : (
                  <Square className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                )}
                <span>
                  <span className={cn('text-sm font-medium', step.checked && 'text-text-muted line-through')}>{step.title}</span>
                  <span className="block text-xs text-text-muted">{step.description}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
            <ThumbsUp className="h-4 w-4" /> Bonnes pratiques
          </h2>
          <p className="text-sm">{methodology.bestPractices}</p>
        </Card>
        <Card>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
            <ShieldAlert className="h-4 w-4" /> Erreurs fréquentes
          </h2>
          <p className="text-sm">{methodology.commonMistakes}</p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <PackageCheck className="h-4 w-4" /> Livrables attendus
        </h2>
        <p className="text-sm">{methodology.deliverables}</p>
      </Card>
    </div>
  )
}
