import { SkillCategory, SkillDifficulty } from '@prisma/client'
import { prisma } from '../src/lib/prisma'
import { seedMethodologies } from './seed-methodologies'

interface SkillSeed {
  slug: string
  title: string
  description: string
  importance: string
  category: SkillCategory
  difficulty: SkillDifficulty
  estimatedHours: number
  position: number
  prerequisites: string[]
  resources: { title: string; url: string; type: 'article' | 'video' | 'course' | 'doc' }[]
  labs: { title: string; platform: string; url: string | null; difficulty: SkillDifficulty }[]
}

const skills: SkillSeed[] = [
  {
    slug: 'linux',
    title: 'Linux',
    description: "Administration système Linux : ligne de commande, permissions, processus, services, scripting bash.",
    importance: "Base incontournable : la grande majorité des serveurs et des outils offensifs tournent sous Linux.",
    category: SkillCategory.linux,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 30,
    position: 1,
    prerequisites: [],
    resources: [
      { title: 'Linux Journey', url: 'https://linuxjourney.com', type: 'course' },
      { title: 'OverTheWire — Bandit', url: 'https://overthewire.org/wargames/bandit/', type: 'course' },
    ],
    labs: [{ title: 'TryHackMe — Linux Fundamentals', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.beginner }],
  },
  {
    slug: 'networking',
    title: 'Réseaux (Networking)',
    description: 'Modèle OSI/TCP-IP, routage, sous-réseaux, protocoles courants, capture et analyse de trafic.',
    importance: "Comprendre comment les machines communiquent est indispensable avant d'auditer un réseau.",
    category: SkillCategory.networking,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 25,
    position: 2,
    prerequisites: [],
    resources: [{ title: 'Professor Messer — Network+', url: 'https://www.professormesser.com', type: 'course' }],
    labs: [{ title: 'TryHackMe — Network Fundamentals', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.beginner }],
  },
  {
    slug: 'windows',
    title: 'Windows',
    description: "Administration Windows : registre, services, PowerShell, gestion des utilisateurs et permissions NTFS.",
    importance: 'La majorité des environnements d\'entreprise reposent sur Windows — indispensable pour le pentest interne.',
    category: SkillCategory.windows,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 25,
    position: 3,
    prerequisites: [],
    resources: [{ title: 'Microsoft Learn — Windows Server', url: 'https://learn.microsoft.com', type: 'doc' }],
    labs: [{ title: 'TryHackMe — Windows Fundamentals', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.beginner }],
  },
  {
    slug: 'dns',
    title: 'DNS',
    description: 'Résolution de noms, types d\'enregistrements, zones, attaques par mauvaise configuration DNS.',
    importance: "Le DNS est souvent le point d'entrée de la reconnaissance et une source fréquente de mauvaises configurations.",
    category: SkillCategory.networking,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 8,
    position: 4,
    prerequisites: ['networking'],
    resources: [{ title: 'Cloudflare Learning — DNS', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/', type: 'article' }],
    labs: [],
  },
  {
    slug: 'http',
    title: 'HTTP',
    description: 'Requêtes/réponses HTTP, en-têtes, cookies, sessions, méthodes, codes de statut.',
    importance: "Le protocole HTTP est la base de toute application web — impossible d'auditer le web sans le maîtriser.",
    category: SkillCategory.web,
    difficulty: SkillDifficulty.beginner,
    estimatedHours: 10,
    position: 5,
    prerequisites: ['networking'],
    resources: [{ title: 'MDN — HTTP Overview', url: 'https://developer.mozilla.org/fr/docs/Web/HTTP/Overview', type: 'doc' }],
    labs: [],
  },
  {
    slug: 'web-security',
    title: 'Sécurité Web',
    description: 'OWASP Top 10, injections, XSS, CSRF, contrôle d\'accès, proxy d\'interception (Burp Suite).',
    importance: "Le pentest web est le domaine le plus demandé pour débuter en tant que pentester junior.",
    category: SkillCategory.web,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 60,
    position: 6,
    prerequisites: ['http', 'linux'],
    resources: [
      { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', type: 'doc' },
      { title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security', type: 'course' },
    ],
    labs: [{ title: 'TryHackMe — Web Fundamentals', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.intermediate }],
  },
  {
    slug: 'api-security',
    title: 'Sécurité des API',
    description: 'REST/GraphQL, authentification par token, OWASP API Top 10, fuzzing d\'endpoints.',
    importance: 'Les API sont omniprésentes dans les architectures modernes et souvent moins auditées que le web classique.',
    category: SkillCategory.api_security,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 20,
    position: 7,
    prerequisites: ['web-security'],
    resources: [{ title: 'OWASP API Security Top 10', url: 'https://owasp.org/www-project-api-security/', type: 'doc' }],
    labs: [],
  },
  {
    slug: 'active-directory',
    title: 'Active Directory',
    description: "Domaines, GPO, Kerberos, délégation, énumération et durcissement d'un annuaire AD.",
    importance: "L'AD est le cœur de la majorité des réseaux d'entreprise — compétence centrale du pentest interne.",
    category: SkillCategory.active_directory,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 50,
    position: 8,
    prerequisites: ['windows', 'networking'],
    resources: [{ title: 'TryHackMe — Active Directory Basics', url: 'https://tryhackme.com', type: 'course' }],
    labs: [{ title: 'HTB Academy — Active Directory', platform: 'Hack The Box', url: 'https://academy.hackthebox.com', difficulty: SkillDifficulty.intermediate }],
  },
  {
    slug: 'privesc',
    title: 'Élévation de privilèges',
    description: "Techniques d'énumération et de durcissement contre l'élévation de privilèges sous Linux et Windows.",
    importance: 'Passer d\'un accès limité à un accès complet est une étape clé de quasi tout engagement de pentest.',
    category: SkillCategory.privesc,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 30,
    position: 9,
    prerequisites: ['linux', 'windows'],
    resources: [{ title: 'GTFOBins', url: 'https://gtfobins.github.io', type: 'doc' }],
    labs: [{ title: 'TryHackMe — Linux/Windows PrivEsc', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.intermediate }],
  },
  {
    slug: 'cloud',
    title: 'Sécurité Cloud',
    description: 'IAM, mauvaises configurations AWS/Azure/GCP, sécurité des conteneurs et du CI/CD.',
    importance: "De plus en plus d'infrastructures sont hébergées dans le cloud — compétence de plus en plus demandée.",
    category: SkillCategory.cloud,
    difficulty: SkillDifficulty.intermediate,
    estimatedHours: 35,
    position: 10,
    prerequisites: ['networking', 'linux'],
    resources: [{ title: 'HTB Academy — Cloud modules', url: 'https://academy.hackthebox.com', type: 'course' }],
    labs: [],
  },
  {
    slug: 'reverse-engineering',
    title: 'Rétro-ingénierie',
    description: 'Analyse statique/dynamique de binaires, assembleur, désassembleurs et débogueurs.',
    importance: "Comprendre le fonctionnement interne des binaires est nécessaire pour l'analyse de malwares et le pwn.",
    category: SkillCategory.reverse_engineering,
    difficulty: SkillDifficulty.advanced,
    estimatedHours: 50,
    position: 11,
    prerequisites: ['linux'],
    resources: [{ title: 'Crackmes.one', url: 'https://crackmes.one', type: 'course' }],
    labs: [],
  },
  {
    slug: 'malware-analysis',
    title: "Analyse de malwares",
    description: 'Sandboxing, IOC, familles de malwares, analyse comportementale en environnement isolé.',
    importance: "Compétence clé côté défensif (Blue Team) et complémentaire pour comprendre les menaces réelles.",
    category: SkillCategory.malware_analysis,
    difficulty: SkillDifficulty.advanced,
    estimatedHours: 40,
    position: 12,
    prerequisites: ['reverse-engineering'],
    resources: [{ title: 'MalwareTech blog', url: 'https://www.malwaretech.com', type: 'article' }],
    labs: [],
  },
  {
    slug: 'forensics',
    title: 'Forensique numérique',
    description: 'Analyse post-incident, artefacts disque/mémoire, timeline, chaîne de custody.',
    importance: "Savoir reconstituer une attaque a posteriori est essentiel en réponse à incident.",
    category: SkillCategory.forensics,
    difficulty: SkillDifficulty.advanced,
    estimatedHours: 35,
    position: 13,
    prerequisites: ['windows', 'linux'],
    resources: [{ title: 'SANS DFIR Posters', url: 'https://www.sans.org/posters/', type: 'doc' }],
    labs: [{ title: 'TryHackMe — DFIR', platform: 'TryHackMe', url: 'https://tryhackme.com', difficulty: SkillDifficulty.advanced }],
  },
  {
    slug: 'red-team',
    title: 'Red Team',
    description: "Simulation d'adversaire complète : discrétion, persistance, C2, mouvement latéral, reporting.",
    importance: "Aboutissement du parcours : mener un engagement complet en conditions réalistes et documenter les résultats.",
    category: SkillCategory.red_team,
    difficulty: SkillDifficulty.expert,
    estimatedHours: 80,
    position: 14,
    prerequisites: ['active-directory', 'privesc', 'web-security'],
    resources: [{ title: 'MITRE ATT&CK', url: 'https://attack.mitre.org', type: 'doc' }],
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
        difficulty: s.difficulty,
        estimatedHours: s.estimatedHours,
        position: s.position,
      },
    })
    idBySlug.set(s.slug, created.id)
  }

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
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
