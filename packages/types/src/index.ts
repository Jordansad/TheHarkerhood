export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type SkillCategory =
  | 'linux'
  | 'networking'
  | 'web'
  | 'active_directory'
  | 'windows'
  | 'privesc'
  | 'api_security'
  | 'cloud'
  | 'reverse_engineering'
  | 'malware_analysis'
  | 'forensics'
  | 'red_team'

export type SkillProgressStatus = 'not_started' | 'in_progress' | 'completed'

export interface ResourceDTO {
  id: string
  title: string
  url: string
  type: 'article' | 'video' | 'course' | 'doc'
}

export interface LabRecommendationDTO {
  id: string
  title: string
  platform: string
  url: string | null
  difficulty: SkillDifficulty
}

export interface SkillDTO {
  id: string
  slug: string
  title: string
  description: string
  importance: string
  category: SkillCategory
  difficulty: SkillDifficulty
  estimatedHours: number
  position: number
  prerequisiteIds: string[]
  resources: ResourceDTO[]
  labs: LabRecommendationDTO[]
  progress: SkillProgressStatus
}

export interface DashboardStatsDTO {
  totalSkills: number
  completedSkills: number
  inProgressSkills: number
  progressPercent: number
  xp: number
  level: number
  xpToNextLevel: number
  streakCount: number
  nextSuggestedSkill: { id: string; slug: string; title: string } | null
}

export type UserRole =
  | 'member'
  | 'mentor'
  | 'ctf_manager'
  | 'documentation_manager'
  | 'infrastructure_manager'
  | 'red_team_lead'
  | 'blue_team_lead'
  | 'training_manager'
  | 'co_founder'
  | 'founder'

export interface UserDTO {
  id: string
  email: string
  displayName: string
  role: UserRole
  xp: number
  level: number
  streakCount: number
  createdAt: string
}

export interface AuthResponseDTO {
  user: UserDTO
}

export type MethodologyCategory =
  | 'web'
  | 'internal'
  | 'active_directory'
  | 'wifi'
  | 'osint'
  | 'ctf'
  | 'bug_bounty'

export interface MethodologyStepDTO {
  id: string
  order: number
  title: string
  description: string
  checked: boolean
}

export interface MethodologyDTO {
  id: string
  slug: string
  title: string
  category: MethodologyCategory
  objective: string
  preparation: string
  tools: string[]
  bestPractices: string
  commonMistakes: string
  deliverables: string
  position: number
  steps: MethodologyStepDTO[]
  progressPercent: number
}
