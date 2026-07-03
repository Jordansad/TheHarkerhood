import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { api } from '@/lib/api-client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'
import type { QuizDTO, QuizSubmitResultDTO } from '@hackerhood/types'

export function QuizTake() {
  const { id } = useParams<{ id: string }>()
  const [quiz, setQuiz] = useState<QuizDTO | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<QuizSubmitResultDTO | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get<{ quiz: QuizDTO }>(`/api/quiz/${id}`).then((data) => setQuiz(data.quiz))
  }, [id])

  async function handleSubmit() {
    if (!id) return
    setSubmitting(true)
    try {
      const data = await api.post<{ result: QuizSubmitResultDTO }>(`/api/quiz/${id}/submit`, { answers })
      setResult(data.result)
    } finally {
      setSubmitting(false)
    }
  }

  if (!quiz) return <FullPageSpinner />

  const resultByQuestionId = new Map(result?.results.map((r) => [r.questionId, r]) ?? [])
  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined)

  return (
    <div className="space-y-6">
      <Link to="/quiz" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" /> Retour aux quiz
      </Link>

      <h1 className="text-2xl font-bold">{quiz.title}</h1>

      {result && (
        <Card className="border-accent/30 bg-accent/5">
          <p className="text-lg font-semibold">Score : {result.score}/{result.total}</p>
        </Card>
      )}

      <div className="space-y-4">
        {quiz.questions.map((q, qi) => {
          const questionResult = resultByQuestionId.get(q.id)
          return (
            <Card key={q.id}>
              <p className="mb-3 font-medium">{qi + 1}. {q.prompt}</p>
              <div className="space-y-2">
                {q.choices.map((choice, ci) => {
                  const isSelected = answers[q.id] === ci
                  const isCorrect = questionResult?.correctIndex === ci
                  const isWrongSelected = questionResult && isSelected && !isCorrect
                  return (
                    <button
                      key={ci}
                      disabled={!!result}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: ci }))}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                        isSelected && !result && 'border-accent bg-accent/10',
                        !isSelected && !result && 'border-border hover:bg-surface-hover',
                        questionResult && isCorrect && 'border-success bg-success/10',
                        isWrongSelected && 'border-danger bg-danger/10',
                        questionResult && !isCorrect && !isWrongSelected && 'border-border opacity-60'
                      )}
                    >
                      {questionResult && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
                      {isWrongSelected && <XCircle className="h-4 w-4 shrink-0 text-danger" />}
                      {choice}
                    </button>
                  )
                })}
              </div>
              {questionResult && <p className="mt-2 text-xs text-text-muted">{questionResult.explanation}</p>}
            </Card>
          )
        })}
      </div>

      {!result && (
        <Button onClick={handleSubmit} disabled={!allAnswered || submitting}>
          {submitting ? 'Correction…' : 'Valider mes réponses'}
        </Button>
      )}
    </div>
  )
}
