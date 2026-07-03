import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { api } from '@/lib/api-client'
import { CATEGORY_LABEL } from '@/lib/category'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FullPageSpinner } from '@/components/ui/Spinner'
import type { SkillCategory } from '@hackerhood/types'

interface QuizSummary {
  id: string
  title: string
  category: SkillCategory
  questionCount: number
}

export function Quiz() {
  const [quizzes, setQuizzes] = useState<QuizSummary[] | null>(null)

  useEffect(() => {
    api.get<{ quizzes: QuizSummary[] }>('/api/quiz').then((data) => setQuizzes(data.quizzes))
  }, [])

  if (!quizzes) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quiz</h1>
        <p className="mt-1 text-sm text-text-muted">QCM pour réviser ce que tu as appris.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {quizzes.map((q) => (
          <Link key={q.id} to={`/quiz/${q.id}`}>
            <Card className="transition-colors hover:border-accent/40">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-accent" />
                <h3 className="font-semibold">{q.title}</h3>
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
