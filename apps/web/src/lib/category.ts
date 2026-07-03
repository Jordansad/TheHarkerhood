import type { SkillCategory, RoadmapPhase } from '@hackerhood/types'

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
  scripting: 'Scripting',
  osint: 'OSINT',
  blue_team: 'Blue Team',
  bug_bounty: 'Bug Bounty',
  containers: 'Conteneurs',
  ai_security: 'Sécurité IA',
  exploitation: 'Exploitation',
}

export const PHASE_LABEL: Record<RoadmapPhase, string> = {
  fondations: 'Phase 1 — Fondations (Mois 1-3)',
  intermediaire: 'Phase 2 — Intermédiaire (Mois 4-6)',
  avance: 'Phase 3 — Avancé (Mois 7-9)',
  expert: 'Phase 4 — Expert (Mois 10-12)',
}

export const PHASE_ORDER: RoadmapPhase[] = ['fondations', 'intermediaire', 'avance', 'expert']
