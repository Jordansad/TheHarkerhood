import { Link } from 'react-router-dom'
import { ClipboardList, ChevronRight } from 'lucide-react'
import { useApiGet } from '@/lib/use-api-get'
import { METHODOLOGY_CATEGORY_LABEL } from '@/lib/methodology-category'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import type { MethodologyDTO } from '@hackerhood/types'

export function Methodologies() {
  const { data, error, retry } = useApiGet<{ methodologies: MethodologyDTO[] }>('/api/methodologies')

  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!data) return <FullPageSpinner />
  const methodologies = data.methodologies

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Méthodologies</h1>
        <p className="mt-1 text-sm text-text-muted">Guides pratiques étape par étape, avec checklist pour suivre ta progression.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {methodologies.map((m) => (
          <Link key={m.id} to={`/methodologies/${m.slug}`}>
            <Card className="transition-colors hover:border-accent/40">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-accent shrink-0" />
                  <span className="text-xs font-medium uppercase tracking-wide text-text-muted">{METHODOLOGY_CATEGORY_LABEL[m.category]}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
              </div>
              <h3 className="mt-2 font-semibold">{m.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{m.objective}</p>
              <div className="mt-3 flex items-center gap-2">
                <ProgressBar value={m.progressPercent} className="flex-1" />
                <span className="text-xs text-text-muted shrink-0">{m.progressPercent}%</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
