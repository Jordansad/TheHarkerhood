import type { UserRole } from '@hackerhood/types'

export const ROLE_LABEL: Record<UserRole, string> = {
  member: 'Member',
  mentor: 'Mentor',
  ctf_manager: 'CTF Manager',
  documentation_manager: 'Documentation Manager',
  infrastructure_manager: 'Infrastructure Manager',
  red_team_lead: 'Red Team Lead',
  blue_team_lead: 'Blue Team Lead',
  training_manager: 'Training Manager',
  co_founder: 'Co-Founder',
  founder: 'Founder',
}
