import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NotebookPen, Plus } from 'lucide-react'
import { api } from '@/lib/api-client'
import { JOURNAL_TYPE_LABEL } from '@/lib/journal-templates'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FullPageSpinner } from '@/components/ui/Spinner'
import type { JournalEntrySummaryDTO } from '@hackerhood/types'

export function Journal() {
  const [entries, setEntries] = useState<JournalEntrySummaryDTO[] | null>(null)

  useEffect(() => {
    api.get<{ entries: JournalEntrySummaryDTO[] }>('/api/journal').then((data) => setEntries(data.entries))
  }, [])

  if (!entries) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Journal</h1>
          <p className="mt-1 text-sm text-text-muted">Notes, write-ups, rapports et entrées quotidiennes.</p>
        </div>
        <Link to="/journal/nouveau">
          <Button><Plus className="h-4 w-4" /> Nouvelle entrée</Button>
        </Link>
      </div>

      {entries.length === 0 ? (
        <Card className="py-12 text-center">
          <NotebookPen className="mx-auto mb-3 h-8 w-8 text-text-muted" />
          <p className="text-sm text-text-muted">Aucune entrée pour le moment. Commence ton portfolio dès maintenant.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <Link key={entry.id} to={`/journal/${entry.id}`}>
              <Card className="transition-colors hover:border-accent/40">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{entry.title}</h3>
                    <p className="mt-1 text-xs text-text-muted">{new Date(entry.updatedAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <Badge>{JOURNAL_TYPE_LABEL[entry.type]}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
