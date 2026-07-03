import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { useApiGet } from '@/lib/use-api-get'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { cn } from '@/lib/utils'
import type { CtfCategoryDTO, CtfCompetitionDTO } from '@hackerhood/types'

export function Ctf() {
  const [tab, setTab] = useState<'categories' | 'calendrier'>('categories')
  const { data: categoriesData, error: categoriesError, retry: retryCategories } = useApiGet<{ categories: CtfCategoryDTO[] }>('/api/ctf/categories')
  const { data: competitionsData, error: competitionsError, retry: retryCompetitions } = useApiGet<{ competitions: CtfCompetitionDTO[] }>('/api/ctf/competitions')
  const categories = categoriesData?.categories ?? null
  const competitions = competitionsData?.competitions ?? null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CTF</h1>
        <p className="mt-1 text-sm text-text-muted">Méthodologie par catégorie et calendrier des compétitions recommandées.</p>
      </div>

      <div className="flex gap-1 rounded-lg border border-border bg-surface p-1 w-fit">
        {(['categories', 'calendrier'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors',
              tab === t ? 'bg-accent/10 text-accent' : 'text-text-muted hover:text-text'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'categories' &&
        (categoriesError ? (
          <ErrorState message={categoriesError} onRetry={retryCategories} />
        ) : !categories ? (
          <FullPageSpinner />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {categories.map((c) => (
              <Link key={c.id} to={`/ctf/${c.slug}`}>
                <Card className="transition-colors hover:border-accent/40">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{c.howToThink}</p>
                </Card>
              </Link>
            ))}
          </div>
        ))}

      {tab === 'calendrier' &&
        (competitionsError ? (
          <ErrorState message={competitionsError} onRetry={retryCompetitions} />
        ) : !competitions ? (
          <FullPageSpinner />
        ) : (
          <div className="space-y-2">
            {competitions.map((comp) => (
              <Card key={comp.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{comp.name}</h3>
                    <p className="text-xs text-text-muted">{comp.frequency} · {comp.level}</p>
                  </div>
                  {comp.url && (
                    <a href={comp.url} target="_blank" rel="noreferrer" className="text-accent hover:underline shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {comp.categories.map((cat) => <Badge key={cat}>{cat}</Badge>)}
                </div>
              </Card>
            ))}
          </div>
        ))}
    </div>
  )
}
