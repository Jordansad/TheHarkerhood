import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import { api, ApiError } from '@/lib/api-client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { Markdown } from '@/components/ui/Markdown'
import { useToast } from '@/lib/use-toast'
import type { SkillTheoryEditDTO } from '@hackerhood/types'

const WORDS_PER_MINUTE = 130
const TARGET_MAX_MINUTES = 20

function estimateMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (words === 0) return 0
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export function SkillTheoryEditor() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    if (!slug) return
    setError(null)
    api
      .get<{ skill: SkillTheoryEditDTO }>(`/api/skills/${slug}/theory-edit`)
      .then((data) => {
        setTitle(data.skill.title)
        setContent(data.skill.theoryContent)
        setPublished(data.skill.theoryPublished)
        setLoading(false)
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Impossible de contacter le serveur.'))
  }, [slug, reloadKey])

  async function handleSave() {
    if (!slug) return
    setSaving(true)
    try {
      await api.put(`/api/skills/${slug}/theory`, { theoryContent: content, theoryPublished: published })
      toast.success(published ? 'Cours enregistré et publié.' : 'Cours enregistré en brouillon.')
      navigate(`/roadmap/${slug}`)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  if (error) return <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
  if (loading) return <FullPageSpinner />

  const minutes = estimateMinutes(content)
  const overTarget = minutes > TARGET_MAX_MINUTES

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(`/roadmap/${slug}`)} className="px-0">
        <ArrowLeft className="h-4 w-4" /> Retour à la compétence
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Cours théorique</p>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${overTarget ? 'border-danger/30 bg-danger/10 text-danger' : 'border-border bg-surface text-text-muted'}`}>
          <Clock className="h-3.5 w-3.5" /> ~{minutes} min de lecture {overTarget && `(objectif : ${TARGET_MAX_MINUTES} min max)`}
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
            Publié — visible par les étudiants
          </label>
          <button type="button" onClick={() => setPreview((p) => !p)} className="text-xs font-medium text-accent hover:underline">
            {preview ? 'Retour à l\'édition' : 'Aperçu'}
          </button>
        </div>

        {preview ? (
          <div className="rounded-lg border border-border bg-bg p-4">
            <Markdown content={content || '*Rien à prévisualiser pour le moment.*'} />
          </div>
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={26}
            placeholder="Rédige le cours en markdown : ## titres, **gras**, listes, ```blocs de code```…"
            className="font-mono text-[13px]"
          />
        )}

        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </Card>
    </div>
  )
}
