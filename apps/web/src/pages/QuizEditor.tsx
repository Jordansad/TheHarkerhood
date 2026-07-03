import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { api, ApiError } from '@/lib/api-client'
import { CATEGORY_LABEL } from '@/lib/category'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useToast } from '@/lib/use-toast'
import type { QuizEditDTO, QuizQuestionEditDTO, SkillCategory } from '@hackerhood/types'

const CATEGORIES = Object.keys(CATEGORY_LABEL) as SkillCategory[]

function emptyQuestion(): QuizQuestionEditDTO {
  return { id: Math.random().toString(36), prompt: '', choices: ['', ''], correctIndex: 0, explanation: '' }
}

export function QuizEditor() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'nouveau'
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<SkillCategory>('linux')
  const [questions, setQuestions] = useState<QuizQuestionEditDTO[]>([emptyQuestion()])

  useEffect(() => {
    if (isNew) return
    setError(null)
    api
      .get<{ quiz: QuizEditDTO }>(`/api/quiz/${id}/edit`)
      .then((data) => {
        setTitle(data.quiz.title)
        setCategory(data.quiz.category)
        setQuestions(data.quiz.questions)
        setLoading(false)
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Impossible de contacter le serveur.'))
  }, [id, isNew, reloadKey])

  function updateQuestion(index: number, patch: Partial<QuizQuestionEditDTO>) {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)))
  }

  function updateChoice(qIndex: number, cIndex: number, value: string) {
    setQuestions((qs) =>
      qs.map((q, i) => (i === qIndex ? { ...q, choices: q.choices.map((c, ci) => (ci === cIndex ? value : c)) } : q))
    )
  }

  function addChoice(qIndex: number) {
    setQuestions((qs) => qs.map((q, i) => (i === qIndex && q.choices.length < 6 ? { ...q, choices: [...q.choices, ''] } : q)))
  }

  function removeChoice(qIndex: number, cIndex: number) {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIndex && q.choices.length > 2
          ? { ...q, choices: q.choices.filter((_, ci) => ci !== cIndex), correctIndex: q.correctIndex >= cIndex && q.correctIndex > 0 ? q.correctIndex - 1 : q.correctIndex }
          : q
      )
    )
  }

  async function handleSave() {
    setSaving(true)
    const body = { title, category, questions: questions.map(({ prompt, choices, correctIndex, explanation }) => ({ prompt, choices, correctIndex, explanation })) }
    try {
      if (isNew) {
        await api.post('/api/quiz', body)
        toast.success('Quiz créé.')
      } else {
        await api.put(`/api/quiz/${id}`, body)
        toast.success('Quiz mis à jour.')
      }
      navigate('/quiz')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  if (error) return <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
  if (loading) return <FullPageSpinner />

  const canSave = title.trim() && questions.every((q) => q.prompt.trim() && q.explanation.trim() && q.choices.every((c) => c.trim()))

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/quiz')} className="px-0">
        <ArrowLeft className="h-4 w-4" /> Retour aux quiz
      </Button>

      <Card className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Titre du quiz</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Web — Injections avancées" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-muted">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SkillCategory)}
              className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {questions.map((q, qi) => (
        <Card key={q.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-muted">Question {qi + 1}</p>
            {questions.length > 1 && (
              <button onClick={() => setQuestions((qs) => qs.filter((_, i) => i !== qi))} className="text-text-muted hover:text-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <Input value={q.prompt} onChange={(e) => updateQuestion(qi, { prompt: e.target.value })} placeholder="Énoncé de la question" />

          <div className="space-y-2">
            {q.choices.map((choice, ci) => (
              <div key={ci} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={q.correctIndex === ci}
                  onChange={() => updateQuestion(qi, { correctIndex: ci })}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                  title="Bonne réponse"
                />
                <Input value={choice} onChange={(e) => updateChoice(qi, ci, e.target.value)} placeholder={`Choix ${ci + 1}`} className="flex-1" />
                {q.choices.length > 2 && (
                  <button onClick={() => removeChoice(qi, ci)} className="text-text-muted hover:text-danger">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
            {q.choices.length < 6 && (
              <button onClick={() => addChoice(qi)} className="text-xs font-medium text-accent hover:underline">
                + Ajouter un choix
              </button>
            )}
          </div>

          <Input value={q.explanation} onChange={(e) => updateQuestion(qi, { explanation: e.target.value })} placeholder="Explication de la réponse" />
        </Card>
      ))}

      <Button variant="secondary" onClick={() => setQuestions((qs) => [...qs, emptyQuestion()])}>
        <Plus className="h-4 w-4" /> Ajouter une question
      </Button>

      <div>
        <Button onClick={handleSave} disabled={!canSave || saving}>
          {saving ? 'Enregistrement…' : 'Enregistrer le quiz'}
        </Button>
      </div>
    </div>
  )
}
