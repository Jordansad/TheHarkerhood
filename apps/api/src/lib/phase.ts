import type { RoadmapPhase } from '@hackerhood/types'

export const PHASE_LABEL: Record<RoadmapPhase, string> = {
  fondations: 'Phase 1 — Fondations',
  intermediaire: 'Phase 2 — Intermédiaire',
  avance: 'Phase 3 — Avancé',
  expert: 'Phase 4 — Expert',
}

export const PHASE_ORDER: RoadmapPhase[] = ['fondations', 'intermediaire', 'avance', 'expert']
