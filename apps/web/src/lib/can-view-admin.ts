import type { UserRole } from '@hackerhood/types'

const ADMIN_ROLES: UserRole[] = ['founder', 'co_founder']

export function canViewAdmin(role: UserRole | undefined): boolean {
  return !!role && ADMIN_ROLES.includes(role)
}
