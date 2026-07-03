import type { ActivityType } from '@hackerhood/types'

export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  thm_room: 'Room TryHackMe',
  htb_easy: 'Machine HTB Easy',
  htb_medium: 'Machine HTB Medium',
  htb_hard: 'Machine HTB Hard',
  ctf_participation: 'Participation CTF',
  ctf_flag: 'Flag CTF résolu',
  writeup: 'Write-up publié',
  script: 'Script/outil développé',
  pentest_report: 'Rapport de pentest',
  mentoring: "Mentorat d'un membre",
  talk: 'Talk/présentation',
  external_cert: 'Certification externe',
}

export const ACTIVITY_POINTS: Partial<Record<ActivityType, number>> = {
  thm_room: 5,
  htb_easy: 10,
  htb_medium: 20,
  htb_hard: 35,
  ctf_participation: 5,
  writeup: 10,
  script: 15,
  pentest_report: 25,
  mentoring: 20,
  talk: 30,
  external_cert: 50,
}

export const ACTIVITY_TYPES = Object.keys(ACTIVITY_LABEL) as ActivityType[]
