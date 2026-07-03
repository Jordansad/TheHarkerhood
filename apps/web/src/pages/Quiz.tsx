import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Plus, Pencil, Trash2 } from 'lucide-react'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/use-auth'
import { canManageQuiz } from '@/lib/can-manage-quiz'
import { CATEGORY_LABEL } from '@/lib/category'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useToast } from '@/lib/use-toast'
import type { QuizSummaryDTO } from '@hackerhood/types'

export function Quiz() {
  const { user } = useAuth()
  const toast = useToast()
  const [quizzes, setQuizzes] = useState<QuizSummaryDTO[] | null>(null)
  const isManager = canManageQuiz(user?.role)

  function load() {
    api.get<{ quizzes: QuizSummaryDTO[] }>('/api/quiz').then((data) => setQuizzes(data.quizzes))
  }

  useEffect(load, [])

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault()
    if (!confirm('Supprimer ce quiz ?')) return
    await api.delete(`/api/quiz/${id}`)
    toast.success('Quiz supprimé.')
    load()
  }

  if (!quizzes) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quiz</h1>
          <p className="mt-1 text-sm text-text-muted">QCM pour réviser ce que tu as appris.</p>
        </div>
        {isManager && (
          <Link to="/quiz/nouveau/editer">
            <Button><Plus className="h-4 w-4" /> Nouveau quiz</Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {quizzes.map((q) => (
          <Link key={q.id} to={`/quiz/${q.id}`}>
            <Card className="transition-colors hover:border-accent/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold">{q.title}</h3>
                </div>
                {isManager && (
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/quiz/${q.id}/editer`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button onClick={(e) => handleDelete(q.id, e)} className="rounded-md p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge>{CATEGORY_LABEL[q.category]}</Badge>
                <span className="text-xs text-text-muted">{q.questionCount} questions</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
