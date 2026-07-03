import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { SkillDifficulty } from '@hackerhood/types'

const DIFFICULTY_CLS: Record<SkillDifficulty, string> = {
  beginner: 'bg-success/10 text-success border-success/30',
  intermediate: 'bg-accent/10 text-accent border-accent/30',
  advanced: 'bg-warning/10 text-warning border-warning/30',
  expert: 'bg-expert/10 text-expert border-expert/30',
}

const DIFFICULTY_LABEL: Record<SkillDifficulty, string> = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
  expert: 'Expert',
}

export function DifficultyBadge({ difficulty }: { difficulty: SkillDifficulty }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', DIFFICULTY_CLS[difficulty])}>
      {DIFFICULTY_LABEL[difficulty]}
    </span>
  )
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-text-muted', className)}>
      {children}
    </span>
  )
}
