import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Plus } from 'lucide-react'
import { api } from '@/lib/api-client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FullPageSpinner } from '@/components/ui/Spinner'
import type { WikiPageSummaryDTO } from '@hackerhood/types'

export function Wiki() {
  const [pages, setPages] = useState<WikiPageSummaryDTO[] | null>(null)

  useEffect(() => {
    api.get<{ pages: WikiPageSummaryDTO[] }>('/api/wiki').then((data) => setPages(data.pages))
  }, [])

  if (!pages) return <FullPageSpinner />

  const grouped = pages.reduce<Record<string, WikiPageSummaryDTO[]>>((acc, p) => {
    ;(acc[p.category] ??= []).push(p)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wiki</h1>
          <p className="mt-1 text-sm text-text-muted">Base de connaissances partagée par la communauté.</p>
        </div>
        <Link to="/wiki/nouveau">
          <Button><Plus className="h-4 w-4" /> Nouvelle page</Button>
        </Link>
      </div>

      {pages.length === 0 ? (
        <Card className="py-12 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-text-muted" />
          <p className="text-sm text-text-muted">Le wiki est vide pour le moment. Ajoute la première page !</p>
        </Card>
      ) : (
        Object.entries(grouped).map(([category, categoryPages]) => (
          <div key={category}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">{category}</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {categoryPages.map((page) => (
                <Link key={page.id} to={`/wiki/${page.slug}`}>
                  <Card className="transition-colors hover:border-accent/40">
                    <h3 className="font-semibold">{page.title}</h3>
                    <p className="mt-1 text-xs text-text-muted">Mis à jour le {new Date(page.updatedAt).toLocaleDateString('fr-FR')}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
