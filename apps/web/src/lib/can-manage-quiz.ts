import type { UserRole } from '@hackerhood/types'

const QUIZ_MANAGER_ROLES: UserRole[] = ['founder', 'co_founder', 'training_manager']

export function canManageQuiz(role: UserRole | undefined): boolean {
  return !!role && QUIZ_MANAGER_ROLES.includes(role)
}
