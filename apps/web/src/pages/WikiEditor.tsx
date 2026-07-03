import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { api } from '@/lib/api-client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useToast } from '@/lib/use-toast'
import type { WikiPageDTO } from '@hackerhood/types'

export function WikiEditor() {
  const { slug } = useParams<{ slug: string }>()
  const isNew = !slug || slug === 'nouveau'
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (isNew) return
    api.get<{ page: WikiPageDTO }>(`/api/wiki/${slug}`).then((data) => {
      setTitle(data.page.title)
      setCategory(data.page.category)
      setContent(data.page.content)
      setLoading(false)
    })
  }, [slug, isNew])

  async function handleSave() {
    setSaving(true)
    try {
      if (isNew) {
        const data = await api.post<{ page: WikiPageDTO }>('/api/wiki', { title, category, content })
        toast.success('Page créée.')
        navigate(`/wiki/${data.page.slug}`)
      } else {
        await api.put<{ page: WikiPageDTO }>(`/api/wiki/${slug}`, { title, category, content })
        toast.success('Page mise à jour.')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!slug || isNew) return
    if (!confirm('Supprimer cette page ?')) return
    await api.delete(`/api/wiki/${slug}`)
    toast.success('Page supprimée.')
    navigate('/wiki')
  }

  if (loading) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/wiki')} className="px-0">
        <ArrowLeft className="h-4 w-4" /> Retour au wiki
      </Button>

      <Card className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Titre</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Cheatsheet Nmap" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Catégorie</label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Linux, Windows, Web..." />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-muted">Contenu (markdown)</label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={20} />
        </div>

        <div className="flex items-center justify-between">
          <Button onClick={handleSave} disabled={saving || !title || !category}>
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
