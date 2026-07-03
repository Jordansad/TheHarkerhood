import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { api } from '@/lib/api-client'
import { ACTIVITY_LABEL, ACTIVITY_POINTS, ACTIVITY_TYPES } from '@/lib/activity-type'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useToast } from '@/lib/use-toast'
import type { ActivityLogDTO, ActivityType } from '@hackerhood/types'

export function Activities() {
  const toast = useToast()
  const [activities, setActivities] = useState<ActivityLogDTO[] | null>(null)
  const [type, setType] = useState<ActivityType>('thm_room')
  const [note, setNote] = useState('')
  const [flagPoints, setFlagPoints] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get<{ activities: ActivityLogDTO[] }>('/api/activities').then((data) => setActivities(data.activities))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const body: { type: ActivityType; note?: string; points?: number } = { type, note: note || undefined }
      if (type === 'ctf_flag') body.points = flagPoints
      const data = await api.post<{ activities: ActivityLogDTO[] }>('/api/activities', body)
      setActivities(data.activities)
      setNote('')
      toast.success('Activité enregistrée !')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!activities) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Journal d'activités</h1>
        <p className="mt-1 text-sm text-text-muted">Déclare tes activités pour gagner des points selon le barème officiel The Hackerhood.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-muted">Type d'activité</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ActivityType)}
                className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {ACTIVITY_LABEL[t]} {ACTIVITY_POINTS[t] ? `(${ACTIVITY_POINTS[t]} pts)` : '(3-15 pts)'}
                  </option>
                ))}
              </select>
            </div>

            {type === 'ctf_flag' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-muted">Points du flag (3-15)</label>
                <Input type="number" min={3} max={15} value={flagPoints} onChange={(e) => setFlagPoints(Number(e.target.value))} />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Note (optionnel)</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex: TryHackMe — Linux Fundamentals 1" />
          </div>

          <Button type="submit" disabled={submitting}>
            <Zap className="h-4 w-4" /> {submitting ? 'Enregistrement…' : 'Déclarer l\'activité'}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-text-muted">Historique récent</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-text-muted">Aucune activité déclarée pour le moment.</p>
        ) : (
          <ul className="divide-y divide-border">
            {activities.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium">{ACTIVITY_LABEL[a.type]}</p>
                  {a.note && <p className="text-xs text-text-muted">{a.note}</p>}
                </div>
                <span className="font-mono text-accent">+{a.points} XP</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
