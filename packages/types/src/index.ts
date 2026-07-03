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

export interface UserDTO {
  id: string
  email: string
  displayName: string
  xp: number
  level: number
  streakCount: number
  createdAt: string
}

export interface AuthResponseDTO {
  user: UserDTO
}
