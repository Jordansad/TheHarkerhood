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
  | 'scripting'
  | 'osint'
  | 'blue_team'
  | 'bug_bounty'
  | 'containers'
  | 'ai_security'
  | 'exploitation'

export type RoadmapPhase = 'fondations' | 'intermediaire' | 'avance' | 'expert'

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
  phase: RoadmapPhase
  difficulty: SkillDifficulty
  estimatedHours: number
  position: number
  prerequisiteIds: string[]
  resources: ResourceDTO[]
  labs: LabRecommendationDTO[]
  progress: SkillProgressStatus
}

export type ProgressionTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'elite' | 'master' | 'legend'

export interface DashboardStatsDTO {
  totalSkills: number
  completedSkills: number
  inProgressSkills: number
  progressPercent: number
  xp: number
  tier: ProgressionTier
  tierLabel: string
  xpToNextTier: number
  streakCount: number
  nextSuggestedSkill: { id: string; slug: string; title: string } | null
  writeupCount: number
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
  tier: ProgressionTier
  tierLabel: string
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

export type ActivityType =
  | 'thm_room'
  | 'htb_easy'
  | 'htb_medium'
  | 'htb_hard'
  | 'ctf_participation'
  | 'ctf_flag'
  | 'writeup'
  | 'script'
  | 'pentest_report'
  | 'mentoring'
  | 'talk'
  | 'external_cert'

export interface ActivityLogDTO {
  id: string
  type: ActivityType
  points: number
  note: string | null
  createdAt: string
}

export type JournalEntryType = 'note' | 'writeup' | 'pentest_report' | 'incident_report' | 'daily'

export interface JournalEntryDTO {
  id: string
  title: string
  content: string
  type: JournalEntryType
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface JournalEntrySummaryDTO {
  id: string
  title: string
  type: JournalEntryType
  tags: string[]
  updatedAt: string
}

export interface WikiPageDTO {
  id: string
  slug: string
  category: string
  title: string
  content: string
  updatedAt: string
}

export interface WikiPageSummaryDTO {
  id: string
  slug: string
  category: string
  title: string
  updatedAt: string
}

export type CtfCategoryType = 'web' | 'crypto' | 'forensics' | 'reverse' | 'osint' | 'pwn' | 'stego' | 'mobile' | 'cloud'

export interface CtfCategoryDTO {
  id: string
  slug: string
  title: string
  category: CtfCategoryType
  howToThink: string
  methodology: string
  tools: string[]
  commonMistakes: string
  keyConcepts: string
  position: number
}

export interface CtfCompetitionDTO {
  id: string
  name: string
  frequency: string
  level: string
  categories: string[]
  url: string | null
  position: number
}

export type CertificationStatus = 'planned' | 'studying' | 'passed'

export interface CertificationDTO {
  id: string
  slug: string
  title: string
  level: string
  notes: string
  position: number
  status: CertificationStatus
}

export interface QuizQuestionDTO {
  id: string
  prompt: string
  choices: string[]
}

export interface QuizDTO {
  id: string
  title: string
  category: SkillCategory
  questions: QuizQuestionDTO[]
}

export interface QuizAnswerResultDTO {
  questionId: string
  correctIndex: number
  explanation: string
}

export interface QuizSubmitResultDTO {
  score: number
  total: number
  results: QuizAnswerResultDTO[]
}

export interface QuizQuestionEditDTO {
  id: string
  prompt: string
  choices: string[]
  correctIndex: number
  explanation: string
}

export interface QuizEditDTO {
  id: string
  title: string
  category: SkillCategory
  questions: QuizQuestionEditDTO[]
}

export interface QuizSummaryDTO {
  id: string
  title: string
  category: SkillCategory
  questionCount: number
}

export interface TeamMemberDTO {
  id: string
  displayName: string
  role: UserRole
  tier: ProgressionTier
  tierLabel: string
  createdAt: string
}

export interface AdminActivityEntryDTO {
  id: string
  displayName: string
  type: ActivityType
  points: number
  createdAt: string
}

export interface AdminMemberStatusDTO {
  id: string
  displayName: string
  role: UserRole
  tier: ProgressionTier
  tierLabel: string
  xp: number
  lastActivityAt: string | null
  daysSinceActivity: number | null
}

export interface AdminOverviewDTO {
  totalMembers: number
  tierBreakdown: { tier: ProgressionTier; label: string; count: number }[]
  topMembers: AdminMemberStatusDTO[]
  inactiveMembers: AdminMemberStatusDTO[]
  recentActivity: AdminActivityEntryDTO[]
}

export interface AiConversationSummaryDTO {
  id: string
  title: string
  createdAt: string
}

export interface AiMessageDTO {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface AiConversationDTO {
  id: string
  title: string
  createdAt: string
  messages: AiMessageDTO[]
}
