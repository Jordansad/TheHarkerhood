import type { MethodologyCategory } from '@hackerhood/types'

export const METHODOLOGY_CATEGORY_LABEL: Record<MethodologyCategory, string> = {
  web: 'Pentest Web',
  internal: 'Pentest Interne',
  active_directory: 'Active Directory',
  wifi: 'Audit WiFi',
  osint: 'OSINT',
  ctf: 'CTF',
  bug_bounty: 'Bug Bounty',
}
