import type { SkillCategory } from '@hackerhood/types'

export const CATEGORY_LABEL: Record<SkillCategory, string> = {
  linux: 'Linux',
  networking: 'Réseaux',
  web: 'Web',
  active_directory: 'Active Directory',
  windows: 'Windows',
  privesc: 'Élévation de privilèges',
  api_security: 'Sécurité API',
  cloud: 'Cloud',
  reverse_engineering: 'Rétro-ingénierie',
  malware_analysis: 'Analyse de malwares',
  forensics: 'Forensique',
  red_team: 'Red Team',
}
