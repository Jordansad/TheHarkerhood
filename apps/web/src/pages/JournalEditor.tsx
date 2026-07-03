import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { api } from '@/lib/api-client'
import { JOURNAL_TYPE_LABEL, JOURNAL_TEMPLATES } from '@/lib/journal-templates'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useToast } from '@/lib/use-toast'
import type { JournalEntryDTO, JournalEntryType } from '@hackerhood/types'

const JOURNAL_TYPES = Object.keys(JOURNAL_TYPE_LABEL) as JournalEntryType[]

export function JournalEditor() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'nouveau'
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<JournalEntryType>('note')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    if (isNew) return
    api.get<{ entry: JournalEntryDTO }>(`/api/journal/${id}`).then((data) => {
      setTitle(data.entry.title)
      setType(data.entry.type)
      setContent(data.entry.content)
      setTags(data.entry.tags.join(', '))
      setLoading(false)
    })
  }, [id, isNew])

  function handleTypeChange(newType: JournalEntryType) {
    setType(newType)
    if (isNew && !content) setContent(JOURNAL_TEMPLATES[newType])
  }

  async function handleSave() {
    setSaving(true)
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean)
    try {
      if (isNew) {
        const data = await api.post<{ entry: JournalEntryDTO }>('/api/journal', { title, content, type, tags: tagList })
        toast.success('Entrée créée.')
        navigate(`/journal/${data.entry.id}`)
      } else {
        await api.put<{ entry: JournalEntryDTO }>(`/api/journal/${id}`, { title, content, tags: tagList })
        toast.success('Entrée mise à jour.')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id || isNew) return
    if (!confirm('Supprimer cette entrée ?')) return
    await api.delete(`/api/journal/${id}`)
    toast.success('Entrée supprimée.')
    navigate('/journal')
  }

  if (loading) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/journal')} className="px-0">
        <ArrowLeft className="h-4 w-4" /> Retour au journal
      </Button>

      <Card className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Titre</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre de l'entrée" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Type</label>
            <select
              value={type}
              disabled={!isNew}
              onChange={(e) => handleTypeChange(e.target.value as JournalEntryType)}
              className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-60"
            >
              {JOURNAL_TYPES.map((t) => (
                <option key={t} value={t}>{JOURNAL_TYPE_LABEL[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">Tags (séparés par des virgules)</label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="htb, web, sqli" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">Contenu (markdown)</label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20} />
        </div>

        <div className="flex items-center justify-between">
          <Button onClick={handleSave} disabled={saving || !title}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
          {!isNew && (
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" /> Supprimer
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
