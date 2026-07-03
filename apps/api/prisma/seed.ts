import { SkillCategory, SkillDifficulty, RoadmapPhase } from '@prisma/client'
import { prisma } from '../src/lib/prisma'
import { seedMethodologies } from './seed-methodologies'
import { seedManualContent } from './seed-manual-content'

interface SkillSeed {
  slug: string
  title: string
  description: string
  importance: string
  category: SkillCategory
  phase: RoadmapPhase
  difficulty: SkillDifficulty
  estimatedHours: number
  position: number
  prerequisites: string[]
  resources: { title: string; url: string; type: 'article' | 'video' | 'course' | 'doc' }[]
  labs: { title: string; platform: string; url: string | null; difficulty: SkillDifficulty }[]
}

// Roadmap 12 mois — contenu issu du Manuel Officiel The Hackerhood Academy (Chapitre 04).
const skills: SkillSeed[] = [
  // ═══ PHASE 1 — FONDATIONS (Mois 1-3) ═══
  {
    slug: 'linux-fundamentals',
    title: 'Linux Fundamentals',
    description: 'Navigation du système de fichiers, permissions Unix (chmod, chown), gestion des processus et services.',
    importance: "Base incontournable : la grande majorité des serveurs et des outils offensifs tournent sous Linux.",
    category: SkillCategory.linux,
    phase: RoadmapPhase.fondations,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 20,
    position: 1,
    prerequisites: [],
    resources: [],
    labs: [
      { title: 'OverTheWire — Bandit', platform: 'OverTheWire', url: 'https://overthewire.org/wargames/bandit/', difficulty: SkillDifficulty.beginner },
      { title: 'TryHackMe — Linux Fundamentals 1-3', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.beginner },
    ],
  },
  {
    slug: 'bash-scripting',
    title: 'Bash Scripting',
    description: "Scripts d'automatisation, boucles, conditions, expressions régulières.",
    importance: 'Automatiser ses tâches de reconnaissance et de post-exploitation fait gagner un temps considérable.',
    category: SkillCategory.scripting,
    phase: RoadmapPhase.fondations,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 15,
    position: 2,
    prerequisites: ['linux-fundamentals'],
    resources: [],
    labs: [{ title: 'TryHackMe — Bash Scripting', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.beginner }],
  },
  {
    slug: 'networking-essentials',
    title: 'Networking Essentials',
    description: 'Modèle OSI/TCP-IP, DNS, HTTP, analyse de trafic réseau.',
    importance: "Comprendre comment les machines communiquent est indispensable avant d'auditer un réseau.",
    category: SkillCategory.networking,
    phase: RoadmapPhase.fondations,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 20,
    position: 3,
    prerequisites: ['bash-scripting'],
    resources: [],
    labs: [
      { title: 'TryHackMe — Pre-Security', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.beginner },
      { title: 'Wireshark basics', platform: 'Wireshark', url: null, difficulty: SkillDifficulty.beginner },
    ],
  },
  {
    slug: 'python-cybersecurite',
    title: 'Python pour la Cybersécurité',
    description: 'Sockets, requests, parsing, scripts d\'automatisation et petits outils.',
    importance: "Python est le langage de référence pour écrire ses propres outils de sécurité.",
    category: SkillCategory.scripting,
    phase: RoadmapPhase.fondations,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 20,
    position: 4,
    prerequisites: ['networking-essentials'],
    resources: [],
    labs: [{ title: "Exercices Python — scripts d'outils simples", platform: 'Exercices personnalisés', url: null, difficulty: SkillDifficulty.beginner }],
  },
  {
    slug: 'introduction-web',
    title: 'Introduction au Web',
    description: 'HTTP, cookies, sessions, en-têtes — les bases indispensables avant le pentest web.',
    importance: "Le protocole HTTP est la base de toute application web — impossible d'auditer le web sans le maîtriser.",
    category: SkillCategory.web,
    phase: RoadmapPhase.fondations,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 15,
    position: 5,
    prerequisites: ['python-cybersecurite'],
    resources: [],
    labs: [
      { title: 'PortSwigger Web Academy — Basics', platform: 'PortSwigger', url: 'https://portswigger.net/web-security', difficulty: SkillDifficulty.beginner },
      { title: 'OWASP Juice Shop', platform: 'OWASP', url: 'https://owasp.org/www-project-juice-shop/', difficulty: SkillDifficulty.beginner },
    ],
  },
  {
    slug: 'git-documentation',
    title: 'Git & Documentation',
    description: 'Versionning, markdown, premier write-up, création du portfolio GitHub.',
    importance: "Un professionnel qui ne documente pas son travail ne peut pas être audité ni transmettre son savoir.",
    category: SkillCategory.scripting,
    phase: RoadmapPhase.fondations,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 10,
    position: 6,
    prerequisites: ['introduction-web'],
    resources: [],
    labs: [{ title: 'GitHub — création de repos, premier write-up', platform: 'GitHub', url: 'https://github.com', difficulty: SkillDifficulty.beginner }],
  },

  // ═══ PHASE 2 — INTERMÉDIAIRE (Mois 4-6) ═══
  {
    slug: 'nmap-reconnaissance',
    title: 'Nmap & Reconnaissance',
    description: 'Scan de ports, détection OS, scripts NSE.',
    importance: "La reconnaissance est la première étape de tout engagement offensif.",
    category: SkillCategory.networking,
    phase: RoadmapPhase.intermediaire,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 15,
    position: 7,
    prerequisites: ['git-documentation'],
    resources: [],
    labs: [
      { title: 'TryHackMe — Nmap', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.intermediate },
      { title: 'HTB — Starting Point', platform: 'Hack The Box', url: 'https://app.hackthebox.com/starting-point', difficulty: SkillDifficulty.beginner },
    ],
  },
  {
    slug: 'web-pentest-injection',
    title: 'Web Pentest — Injection',
    description: 'SQLi, XSS, CSRF, File Upload — les vulnérabilités web les plus courantes.',
    importance: "Le pentest web est le domaine le plus demandé pour débuter en tant que pentester junior.",
    category: SkillCategory.web,
    phase: RoadmapPhase.intermediaire,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 25,
    position: 8,
    prerequisites: ['nmap-reconnaissance'],
    resources: [{ title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', type: 'doc' }],
    labs: [
      { title: 'PortSwigger — SQL Injection labs', platform: 'PortSwigger', url: 'https://portswigger.net/web-security/sql-injection', difficulty: SkillDifficulty.intermediate },
      { title: 'PortSwigger — XSS labs', platform: 'PortSwigger', url: 'https://portswigger.net/web-security/cross-site-scripting', difficulty: SkillDifficulty.intermediate },
    ],
  },
  {
    slug: 'burp-suite',
    title: 'Burp Suite Maîtrise',
    description: 'Proxy, Intruder, Repeater, Scanner — l\'outil central du pentest web.',
    importance: "Burp Suite est l'outil de référence utilisé par la quasi-totalité des pentesters web.",
    category: SkillCategory.web,
    phase: RoadmapPhase.intermediaire,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 20,
    position: 9,
    prerequisites: ['web-pentest-injection'],
    resources: [],
    labs: [
      { title: 'PortSwigger — Burp Labs', platform: 'PortSwigger', url: 'https://portswigger.net/web-security', difficulty: SkillDifficulty.intermediate },
      { title: 'DVWA', platform: 'DVWA', url: null, difficulty: SkillDifficulty.intermediate },
    ],
  },
  {
    slug: 'metasploit',
    title: 'Metasploit Framework',
    description: 'Exploits, payloads, meterpreter, post-exploitation.',
    importance: "Metasploit reste une référence pour comprendre le cycle complet d'un exploit en environnement de lab.",
    category: SkillCategory.exploitation,
    phase: RoadmapPhase.intermediaire,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 20,
    position: 10,
    prerequisites: ['burp-suite'],
    resources: [],
    labs: [
      { title: 'TryHackMe — Metasploit', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.intermediate },
      { title: 'Metasploitable 2', platform: 'VulnHub', url: null, difficulty: SkillDifficulty.intermediate },
    ],
  },
  {
    slug: 'password-attacks',
    title: 'Password Attacks',
    description: 'Hashcat, John the Ripper, wordlists et règles de mutation.',
    importance: "Les mots de passe faibles restent l'un des vecteurs de compromission les plus courants.",
    category: SkillCategory.exploitation,
    phase: RoadmapPhase.intermediaire,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 15,
    position: 11,
    prerequisites: ['metasploit'],
    resources: [],
    labs: [{ title: 'TryHackMe — John / Hashcat rooms', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.intermediate }],
  },
  {
    slug: 'privesc-linux',
    title: 'Privilege Escalation Linux',
    description: 'SUID, sudo, cron, exploits kernel.',
    importance: 'Passer d\'un accès limité à un accès complet est une étape clé de quasi tout engagement de pentest.',
    category: SkillCategory.privesc,
    phase: RoadmapPhase.intermediaire,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 20,
    position: 12,
    prerequisites: ['password-attacks'],
    resources: [{ title: 'GTFOBins', url: 'https://gtfobins.github.io', type: 'doc' }],
    labs: [
      { title: 'TryHackMe — Linux PrivEsc', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.intermediate },
      { title: 'HTB — Linux boxes', platform: 'Hack The Box', url: 'https://app.hackthebox.com', difficulty: SkillDifficulty.intermediate },
    ],
  },

  // ═══ PHASE 3 — AVANCÉ (Mois 7-9) ═══
  {
    slug: 'active-directory',
    title: 'Active Directory',
    description: 'Kerberos, LDAP, BloodHound, PowerView.',
    importance: "L'AD est le cœur de la majorité des réseaux d'entreprise — compétence centrale du pentest interne.",
    category: SkillCategory.active_directory,
    phase: RoadmapPhase.avance,
    difficulty: SkillDifficulty.advanced,
    estimatedHours: 30,
    position: 13,
    prerequisites: ['privesc-linux'],
    resources: [],
    labs: [
      { title: 'TryHackMe — Active Directory', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.advanced },
      { title: 'HTB — Windows boxes', platform: 'Hack The Box', url: 'https://app.hackthebox.com', difficulty: SkillDifficulty.advanced },
    ],
  },
  {
    slug: 'privesc-windows',
    title: 'Windows Privilege Escalation',
    description: 'Token impersonation, AlwaysInstallElevated, et autres vecteurs Windows.',
    importance: "Complète la maîtrise de l'élévation de privilèges sur les deux systèmes d'exploitation majeurs.",
    category: SkillCategory.privesc,
    phase: RoadmapPhase.avance,
    difficulty: SkillDifficulty.advanced,
    estimatedHours: 20,
    position: 14,
    prerequisites: ['active-directory'],
    resources: [],
    labs: [{ title: 'TryHackMe — Windows PrivEsc', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.advanced }],
  },
  {
    slug: 'blue-team-soc',
    title: 'Blue Team — SOC Basics',
    description: 'SIEM, alertes, triage, investigation.',
    importance: "Comprendre la défense rend aussi meilleur en offensif — et ouvre la voie SOC/Blue Team.",
    category: SkillCategory.blue_team,
    phase: RoadmapPhase.avance,
    difficulty: SkillDifficulty.advanced,
    estimatedHours: 20,
    position: 15,
    prerequisites: ['privesc-windows'],
    resources: [],
    labs: [
      { title: 'CyberDefenders', platform: 'CyberDefenders', url: 'https://cyberdefenders.org', difficulty: SkillDifficulty.advanced },
      { title: 'TryHackMe — SOC Level 1', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.advanced },
    ],
  },
  {
    slug: 'forensics-ir',
    title: 'Forensics & Incident Response',
    description: 'Analyse de logs, memory forensics, timeline.',
    importance: "Savoir reconstituer une attaque a posteriori est essentiel en réponse à incident.",
    category: SkillCategory.forensics,
    phase: RoadmapPhase.avance,
    difficulty: SkillDifficulty.advanced,
    estimatedHours: 25,
    position: 16,
    prerequisites: ['blue-team-soc'],
    resources: [],
    labs: [
      { title: 'BlueTeamLabs Online', platform: 'BlueTeamLabs Online', url: 'https://blueteamlabs.online', difficulty: SkillDifficulty.advanced },
      { title: 'CyberDefenders', platform: 'CyberDefenders', url: 'https://cyberdefenders.org', difficulty: SkillDifficulty.advanced },
    ],
  },
  {
    slug: 'cloud-security',
    title: 'Cloud Security',
    description: 'IAM, buckets S3, mauvaises configurations AWS/Azure.',
    importance: "De plus en plus d'infrastructures sont hébergées dans le cloud — compétence de plus en plus demandée.",
    category: SkillCategory.cloud,
    phase: RoadmapPhase.avance,
    difficulty: SkillDifficulty.advanced,
    estimatedHours: 20,
    position: 17,
    prerequisites: ['forensics-ir'],
    resources: [],
    labs: [{ title: 'TryHackMe — Cloud, AWS/Azure basics', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.advanced }],
  },
  {
    slug: 'docker-containers',
    title: 'Docker & Containers',
    description: "Escape de conteneur, mauvaises configurations, scanning d'images.",
    importance: "Les architectures modernes reposent massivement sur les conteneurs — une surface d'attaque à part entière.",
    category: SkillCategory.containers,
    phase: RoadmapPhase.avance,
    difficulty: SkillDifficulty.advanced,
    estimatedHours: 15,
    position: 18,
    prerequisites: ['cloud-security'],
    resources: [],
    labs: [{ title: 'TryHackMe — Container Security', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.advanced }],
  },

  // ═══ PHASE 4 — EXPERT (Mois 10-12) ═══
  {
    slug: 'osint-avance',
    title: 'OSINT Avancé',
    description: 'Maltego, Shodan, Recon-ng, OSINT Framework.',
    importance: "Une reconnaissance approfondie conditionne la réussite de tout engagement, offensif comme défensif.",
    category: SkillCategory.osint,
    phase: RoadmapPhase.expert,
    difficulty: SkillDifficulty.expert,
    estimatedHours: 20,
    position: 19,
    prerequisites: ['docker-containers'],
    resources: [],
    labs: [{ title: 'TryHackMe — OSINT', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.expert }],
  },
  {
    slug: 'api-security',
    title: 'API Security',
    description: 'OWASP API Top 10, fuzzing d\'API.',
    importance: "Les API sont omniprésentes dans les architectures modernes et souvent moins auditées que le web classique.",
    category: SkillCategory.api_security,
    phase: RoadmapPhase.expert,
    difficulty: SkillDifficulty.expert,
    estimatedHours: 20,
    position: 20,
    prerequisites: ['osint-avance'],
    resources: [{ title: 'OWASP API Security Top 10', url: 'https://owasp.org/www-project-api-security/', type: 'doc' }],
    labs: [{ title: 'PortSwigger — API labs', platform: 'PortSwigger', url: 'https://portswigger.net/web-security', difficulty: SkillDifficulty.expert }],
  },
  {
    slug: 'malware-analysis',
    title: 'Malware Analysis',
    description: 'Analyse statique/dynamique, YARA, IOC.',
    importance: "Compétence clé côté défensif et complémentaire pour comprendre les menaces réelles.",
    category: SkillCategory.malware_analysis,
    phase: RoadmapPhase.expert,
    difficulty: SkillDifficulty.expert,
    estimatedHours: 25,
    position: 21,
    prerequisites: ['api-security'],
    resources: [],
    labs: [
      { title: 'CyberDefenders', platform: 'CyberDefenders', url: 'https://cyberdefenders.org', difficulty: SkillDifficulty.expert },
      { title: 'AnyRun sandbox', platform: 'AnyRun', url: 'https://any.run', difficulty: SkillDifficulty.expert },
    ],
  },
  {
    slug: 'ai-llm-security',
    title: 'AI & LLM Security',
    description: 'Prompt injection, jailbreak, attaques sur les LLMs.',
    importance: "L'IA générative s'intègre partout — une nouvelle surface d'attaque à maîtriser dès maintenant.",
    category: SkillCategory.ai_security,
    phase: RoadmapPhase.expert,
    difficulty: SkillDifficulty.expert,
    estimatedHours: 15,
    position: 22,
    prerequisites: ['malware-analysis'],
    resources: [{ title: 'OWASP LLM Top 10', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', type: 'doc' }],
    labs: [],
  },
  {
    slug: 'bug-bounty-roadmap',
    title: 'Bug Bounty',
    description: 'Rapport de vulnérabilité, responsible disclosure.',
    importance: "Une excellente façon de valider ses compétences en conditions réelles, cadrées et légales.",
    category: SkillCategory.bug_bounty,
    phase: RoadmapPhase.expert,
    difficulty: SkillDifficulty.expert,
    estimatedHours: 25,
    position: 23,
    prerequisites: ['ai-llm-security'],
    resources: [],
    labs: [
      { title: 'HackerOne', platform: 'HackerOne', url: 'https://hackerone.com', difficulty: SkillDifficulty.expert },
      { title: 'Bugcrowd', platform: 'Bugcrowd', url: 'https://bugcrowd.com', difficulty: SkillDifficulty.expert },
    ],
  },
  {
    slug: 'projet-final-portfolio',
    title: 'Projet Final & Portfolio',
    description: 'Pentest complet et rapport professionnel, présentation devant la communauté.',
    importance: "Aboutissement du parcours : mener un engagement complet en conditions réalistes et documenter les résultats.",
    category: SkillCategory.red_team,
    phase: RoadmapPhase.expert,
    difficulty: SkillDifficulty.expert,
    estimatedHours: 30,
    position: 24,
    prerequisites: ['bug-bounty-roadmap'],
    resources: [],
    labs: [],
  },
]

async function main() {
  console.log('Seeding skills...')
  const idBySlug = new Map<string, string>()

  for (const s of skills) {
    const created = await prisma.skill.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        description: s.description,
        importance: s.importance,
        category: s.category,
        phase: s.phase,
        difficulty: s.difficulty,
        estimatedHours: s.estimatedHours,
        position: s.position,
      },
      create: {
        slug: s.slug,
        title: s.title,
        description: s.description,
        importance: s.importance,
        category: s.category,
        phase: s.phase,
        difficulty: s.difficulty,
        estimatedHours: s.estimatedHours,
        position: s.position,
      },
    })
    idBySlug.set(s.slug, created.id)
  }

  // Retire les anciennes compétences abstraites remplacées par la roadmap 12 mois réelle.
  await prisma.skill.deleteMany({ where: { slug: { notIn: skills.map((s) => s.slug) } } })

  for (const s of skills) {
    const skillId = idBySlug.get(s.slug)!

    await prisma.skill.update({
      where: { id: skillId },
      data: {
        prerequisites: {
          set: s.prerequisites.map((slug) => ({ id: idBySlug.get(slug)! })),
        },
      },
    })

    await prisma.resourceLink.deleteMany({ where: { skillId } })
    if (s.resources.length > 0) {
      await prisma.resourceLink.createMany({
        data: s.resources.map((r) => ({ ...r, skillId })),
      })
    }

    await prisma.labRecommendation.deleteMany({ where: { skillId } })
    if (s.labs.length > 0) {
      await prisma.labRecommendation.createMany({
        data: s.labs.map((l) => ({ ...l, skillId })),
      })
    }
  }

  console.log(`Seeded ${skills.length} skills.`)

  await seedMethodologies()
  await seedManualContent()
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
