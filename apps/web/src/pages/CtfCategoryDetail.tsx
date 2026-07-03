import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Brain, ListChecks, Wrench, ShieldAlert, Lightbulb } from 'lucide-react'
import { api } from '@/lib/api-client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FullPageSpinner } from '@/components/ui/Spinner'
import type { CtfCategoryDTO } from '@hackerhood/types'

export function CtfCategoryDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<CtfCategoryDTO | null>(null)

  useEffect(() => {
    if (!slug) return
    api.get<{ category: CtfCategoryDTO }>(`/api/ctf/categories/${slug}`).then((data) => setCategory(data.category))
  }, [slug])

  if (!category) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <Link to="/ctf" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" /> Retour au CTF
      </Link>

      <h1 className="text-2xl font-bold">{category.title}</h1>

      <Card>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Brain className="h-4 w-4" /> Comment y penser
        </h2>
        <p className="text-sm">{category.howToThink}</p>
      </Card>

      <Card>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <ListChecks className="h-4 w-4" /> Méthodologie
        </h2>
        <p className="text-sm">{category.methodology}</p>
      </Card>

      <Card>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Wrench className="h-4 w-4" /> Outils
        </h2>
        <div className="flex flex-wrap gap-2">
          {category.tools.map((t) => <Badge key={t}>{t}</Badge>)}
        </div>
      </Card>

      <Card>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <ShieldAlert className="h-4 w-4" /> Erreurs fréquentes
        </h2>
        <p className="text-sm">{category.commonMistakes}</p>
      </Card>

      <Card>
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Lightbulb className="h-4 w-4" /> Concepts clés
        </h2>
        <p className="text-sm">{category.keyConcepts}</p>
      </Card>
    </div>
  )
}
