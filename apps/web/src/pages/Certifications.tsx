import { useEffect, useState } from 'react'
import { Award } from 'lucide-react'
import { api } from '@/lib/api-client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { FullPageSpinner } from '@/components/ui/Spinner'
import type { CertificationDTO, CertificationStatus } from '@hackerhood/types'

const STATUS_OPTIONS: { value: CertificationStatus; label: string }[] = [
  { value: 'planned', label: 'Prévue' },
  { value: 'studying', label: 'En préparation' },
  { value: 'passed', label: 'Obtenue' },
]

const STATUS_COLOR: Record<CertificationStatus, string> = {
  planned: 'text-text-muted',
  studying: 'text-info',
  passed: 'text-success',
}

export function Certifications() {
  const [certifications, setCertifications] = useState<CertificationDTO[] | null>(null)

  useEffect(() => {
    api.get<{ certifications: CertificationDTO[] }>('/api/certifications').then((data) => setCertifications(data.certifications))
  }, [])

  async function updateStatus(id: string, status: CertificationStatus) {
    const data = await api.patch<{ certifications: CertificationDTO[] }>(`/api/certifications/${id}/status`, { status })
    setCertifications(data.certifications)
  }

  if (!certifications) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Certifications</h1>
        <p className="mt-1 text-sm text-text-muted">Catalogue recommandé et suivi de ta progression.</p>
      </div>

      <div className="space-y-2">
        {certifications.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Award className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-0.5 text-sm text-text-muted">{c.notes}</p>
                  <Badge className="mt-2">{c.level}</Badge>
                </div>
              </div>
              <select
                value={c.status}
                onChange={(e) => updateStatus(c.id, e.target.value as CertificationStatus)}
                className={cn('shrink-0 rounded-lg border border-border bg-bg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50', STATUS_COLOR[c.status])}
              >
                {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
