import { CtfCategoryType, SkillCategory } from '@prisma/client'
import { prisma } from '../src/lib/prisma'

interface CtfCategorySeed {
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

const ctfCategories: CtfCategorySeed[] = [
  {
    slug: 'ctf-web',
    title: 'Web',
    category: CtfCategoryType.web,
    howToThink: "Penser comme un utilisateur qui détourne le fonctionnement prévu de l'application : chaque entrée est une surface potentielle, chaque fonctionnalité cache une hypothèse de confiance à remettre en question.",
    methodology: "Cartographier l'application, identifier les points d'entrée (paramètres, cookies, headers), tester systématiquement les classes de vulnérabilités OWASP, observer les réponses du serveur pour des indices.",
    tools: ['Burp Suite', 'DevTools navigateur', 'ffuf / gobuster', 'CyberChef'],
    commonMistakes: "Se concentrer uniquement sur l'injection SQL en ignorant la logique métier, ne pas inspecter le code source/JS côté client.",
    keyConcepts: "Contrôle d'accès, sérialisation, gestion de session, validation d'entrée côté serveur vs client.",
    position: 1,
  },
  {
    slug: 'ctf-crypto',
    title: 'Crypto',
    category: CtfCategoryType.crypto,
    howToThink: "Identifier d'abord le type de chiffrement/encodage avant de chercher une faiblesse — la plupart des challenges reposent sur une mauvaise implémentation plutôt que sur une faille mathématique.",
    methodology: "Analyser le format des données (encodage, longueur, motifs répétés), identifier l'algorithme, rechercher les faiblesses d'implémentation connues.",
    tools: ['CyberChef', 'OpenSSL', 'Python (pycryptodome)', 'RsaCtfTool'],
    commonMistakes: "Essayer de casser le chiffrement lui-même au lieu de chercher une erreur d'implémentation, ignorer les indices de contexte.",
    keyConcepts: "Chiffrement symétrique/asymétrique, encodage vs chiffrement, hachage, modes opératoires.",
    position: 2,
  },
  {
    slug: 'ctf-forensics',
    title: 'Forensics',
    category: CtfCategoryType.forensics,
    howToThink: "Traiter chaque fichier comme une scène de crime numérique : chercher ce qui est caché, modifié ou supprimé plutôt que ce qui est visible en surface.",
    methodology: "Identifier le type de fichier réel, examiner les métadonnées, rechercher des données cachées, reconstituer une timeline si plusieurs artefacts sont fournis.",
    tools: ['Autopsy', 'Volatility', 'binwalk', 'exiftool', 'Wireshark'],
    commonMistakes: "Ignorer les métadonnées, ne pas vérifier le vrai type de fichier (magic bytes), négliger l'analyse mémoire.",
    keyConcepts: "Systèmes de fichiers, métadonnées, mémoire volatile, artefacts réseau.",
    position: 3,
  },
  {
    slug: 'ctf-reverse',
    title: 'Reverse',
    category: CtfCategoryType.reverse,
    howToThink: "Comprendre l'intention du programme avant de plonger dans chaque instruction — repérer les fonctions clés donne une carte pour naviguer efficacement.",
    methodology: "Analyse statique d'abord (strings, imports, structure) pour une vue d'ensemble, puis analyse dynamique (débogueur) pour confirmer les hypothèses.",
    tools: ['Ghidra', 'IDA Free', 'x64dbg', 'strings / file'],
    commonMistakes: "Se lancer directement dans le désassemblage sans analyse statique préalable, ignorer les chaînes de caractères.",
    keyConcepts: "Assembleur, structures de contrôle bas niveau, conventions d'appel, formats binaires (ELF/PE).",
    position: 4,
  },
  {
    slug: 'ctf-osint',
    title: 'OSINT',
    category: CtfCategoryType.osint,
    howToThink: "Partir d'un indice minimal et croiser méthodiquement les sources publiques — la patience et la vérification croisée priment sur la vitesse.",
    methodology: "Identifier les métadonnées disponibles, croiser les informations entre plusieurs sources, vérifier chaque hypothèse avant de la considérer acquise.",
    tools: ['Google dorking', 'Recherche d\'image inversée', 'Shodan', 'Wayback Machine'],
    commonMistakes: "S'arrêter à la première information trouvée sans vérification, négliger les métadonnées des fichiers fournis.",
    keyConcepts: "Sources ouvertes, métadonnées, corrélation d'informations, vérification.",
    position: 5,
  },
  {
    slug: 'ctf-pwn',
    title: 'Pwn',
    category: CtfCategoryType.pwn,
    howToThink: "Repérer où le programme fait confiance à une entrée utilisateur sans la valider correctement — c'est là que réside la vulnérabilité à comprendre conceptuellement.",
    methodology: "Analyser le binaire pour comprendre sa structure mémoire et ses protections, identifier la fonction vulnérable, comprendre l'impact avant toute tentative en environnement de lab autorisé.",
    tools: ['pwntools', 'gdb + pwndbg', 'checksec'],
    commonMistakes: "Ignorer les protections binaires en place (ASLR, canaris, NX), ne pas vérifier l'architecture avant d'analyser.",
    keyConcepts: "Gestion de la mémoire, pile d'exécution, protections mémoire modernes.",
    position: 6,
  },
  {
    slug: 'ctf-stego',
    title: 'Stéganographie',
    category: CtfCategoryType.stego,
    howToThink: "Chercher ce qui est dissimulé dans un fichier apparemment normal — l'information est là où on ne s'attend pas à la trouver.",
    methodology: "Examiner les métadonnées, comparer la taille du fichier à son contenu apparent, essayer des outils courants, vérifier les couches de couleur/audio.",
    tools: ['steghide', 'zsteg', 'binwalk', 'Audacity (analyse spectrale)'],
    commonMistakes: "Ignorer l'analyse spectrale pour les fichiers audio, ne pas essayer plusieurs outils sur le même fichier.",
    keyConcepts: "Encodage dans les bits de poids faible, formats de fichiers, dissimulation multi-couches.",
    position: 7,
  },
  {
    slug: 'ctf-mobile',
    title: 'Mobile',
    category: CtfCategoryType.mobile,
    howToThink: "Traiter l'application comme un client qui ne devrait jamais faire confiance à l'utilisateur final — chercher ce qui a été oublié côté développeur.",
    methodology: "Décompiler l'application, analyser le code pour des secrets codés en dur, examiner les communications réseau, vérifier le stockage local.",
    tools: ['jadx', 'apktool', 'MobSF', 'Burp Suite (proxy mobile)'],
    commonMistakes: "Ignorer les fichiers de configuration embarqués, ne pas intercepter le trafic réseau de l'application.",
    keyConcepts: "Décompilation Android/iOS, stockage sécurisé, communication client-serveur.",
    position: 8,
  },
  {
    slug: 'ctf-cloud',
    title: 'Cloud',
    category: CtfCategoryType.cloud,
    howToThink: "Considérer chaque service cloud comme potentiellement mal configuré par défaut — les vulnérabilités viennent presque toujours d'une permission trop large.",
    methodology: "Identifier les services exposés, vérifier les permissions IAM et les politiques de stockage, rechercher des identifiants exposés dans le code ou la configuration.",
    tools: ['ScoutSuite', 'Pacu', 'AWS CLI / Azure CLI', 'CloudFox'],
    commonMistakes: "Ignorer les métadonnées d'instance, ne pas vérifier les permissions par défaut souvent trop permissives.",
    keyConcepts: "IAM, stockage objet, métadonnées d'instance, principe du moindre privilège.",
    position: 9,
  },
]

const ctfCompetitions = [
  { name: 'PicoCTF', frequency: 'Annuel (printemps)', level: 'Débutant → Intermédiaire', categories: ['Crypto', 'Web', 'Forensics', 'Pwn'], url: 'https://picoctf.org', position: 1 },
  { name: 'HTB CTF', frequency: 'Trimestriel', level: 'Intermédiaire → Expert', categories: ['Pentest', 'Reverse', 'Pwn'], url: 'https://ctf.hackthebox.com', position: 2 },
  { name: 'Google CTF', frequency: 'Annuel (été)', level: 'Expert', categories: ['Reverse', 'Crypto', 'Web', 'Pwn'], url: 'https://capturetheflag.withgoogle.com', position: 3 },
  { name: 'CTFtime.org', frequency: 'Continu (calendrier)', level: 'Tous niveaux', categories: ['Toutes catégories'], url: 'https://ctftime.org', position: 4 },
  { name: 'Root-Me CTF', frequency: 'Mensuel', level: 'Débutant → Avancé', categories: ['Web', 'Réseau', 'Forensics'], url: 'https://www.root-me.org', position: 5 },
  { name: 'CyberDefenders', frequency: 'Mensuel', level: 'Blue Team', categories: ['SOC', 'Malware', 'IR'], url: 'https://cyberdefenders.org', position: 6 },
  { name: 'NahamCon CTF', frequency: 'Annuel', level: 'Intermédiaire', categories: ['Web', 'OSINT', 'Misc'], url: null, position: 7 },
  { name: 'DEFCON CTF Quals', frequency: 'Annuel (été)', level: 'Expert absolu', categories: ['Toutes catégories'], url: null, position: 8 },
  { name: 'HackTheBox Uni CTF', frequency: 'Annuel (automne)', level: 'Étudiants', categories: ['Pentest', 'Web', 'Crypto'], url: null, position: 9 },
  { name: 'BlueTeamLabs CTF', frequency: 'Trimestriel', level: 'Blue Team', categories: ['DFIR', 'Threat Hunting'], url: null, position: 10 },
]

const certifications = [
  { slug: 'ejpt', title: 'eJPT (eLearnSecurity)', level: 'Débutant', notes: 'Premier pentest certifié, idéal après la Phase 2 de la roadmap.', position: 1 },
  { slug: 'security-plus', title: 'CompTIA Security+', level: 'Débutant', notes: 'Référence reconnue mondialement, orientée théorique.', position: 2 },
  { slug: 'htb-cpts', title: 'HTB CPTS', level: 'Intermédiaire', notes: 'Certification pratique Hack The Box, très reconnue sur le terrain.', position: 3 },
  { slug: 'htb-cdsa', title: 'HTB CDSA', level: 'Intermédiaire', notes: 'Blue Team / SOC, Hack The Box.', position: 4 },
  { slug: 'oscp', title: 'OSCP (OffSec)', level: 'Avancé', notes: "Standard de l'industrie pour le pentest.", position: 5 },
  { slug: 'pnpt', title: 'PNPT (TCM Security)', level: 'Intermédiaire', notes: 'Pentest pratique avec rapport inclus, très bon rapport qualité/prix.', position: 6 },
  { slug: 'ceh', title: 'CEH (EC-Council)', level: 'Intermédiaire', notes: 'Reconnu en entreprise, orienté compliance.', position: 7 },
  { slug: 'cissp', title: 'CISSP', level: 'Expert', notes: 'Management de la sécurité, pour les profils seniors.', position: 8 },
]

const quizzes = [
  {
    title: 'Linux — Fondamentaux',
    category: SkillCategory.linux,
    questions: [
      { prompt: 'Quelle commande modifie les permissions d\'un fichier ?', choices: ['chmod', 'chown', 'chgrp', 'chattr'], correctIndex: 0, explanation: 'chmod modifie les permissions (lecture/écriture/exécution) ; chown modifie le propriétaire.' },
      { prompt: 'Quel fichier contient la liste des utilisateurs du système ?', choices: ['/etc/shadow', '/etc/passwd', '/etc/users', '/etc/hosts'], correctIndex: 1, explanation: '/etc/passwd liste les comptes utilisateurs ; /etc/shadow contient les mots de passe hashés.' },
      { prompt: 'Que fait la commande `ps aux` ?', choices: ['Liste les fichiers', 'Liste les processus en cours', 'Affiche les permissions', 'Modifie un utilisateur'], correctIndex: 1, explanation: 'ps aux affiche tous les processus en cours d\'exécution sur le système.' },
    ],
  },
  {
    title: 'Réseaux — Fondamentaux',
    category: SkillCategory.networking,
    questions: [
      { prompt: 'À quelle couche OSI appartient le protocole TCP ?', choices: ['Couche 2 — Liaison', 'Couche 3 — Réseau', 'Couche 4 — Transport', 'Couche 7 — Application'], correctIndex: 2, explanation: 'TCP est un protocole de la couche Transport (couche 4).' },
      { prompt: 'Quel port est utilisé par défaut pour HTTPS ?', choices: ['80', '443', '22', '21'], correctIndex: 1, explanation: 'HTTPS utilise le port 443 par défaut ; HTTP utilise le port 80.' },
      { prompt: 'Que signifie DNS ?', choices: ['Domain Name System', 'Dynamic Network Service', 'Data Network Security', 'Domain Network Server'], correctIndex: 0, explanation: 'DNS (Domain Name System) traduit les noms de domaine en adresses IP.' },
    ],
  },
  {
    title: 'Web — OWASP Top 10',
    category: SkillCategory.web,
    questions: [
      { prompt: 'Que permet une injection SQL réussie ?', choices: ['Modifier le CSS de la page', "Manipuler les requêtes vers la base de données", 'Ralentir le serveur uniquement', 'Changer la langue du site'], correctIndex: 1, explanation: "Une injection SQL permet d'altérer les requêtes envoyées à la base de données, pouvant mener à une fuite ou modification de données." },
      { prompt: 'Que signifie XSS ?', choices: ['Cross-Site Scripting', 'External Site Security', 'XML Site Structure', 'Cross-Server Sync'], correctIndex: 0, explanation: 'XSS (Cross-Site Scripting) permet d\'injecter du code JavaScript exécuté dans le navigateur de la victime.' },
      { prompt: "Quel en-tête HTTP aide à prévenir le clickjacking ?", choices: ['Content-Type', 'X-Frame-Options', 'Set-Cookie', 'Accept-Language'], correctIndex: 1, explanation: "X-Frame-Options contrôle si une page peut être affichée dans une <iframe>, limitant le clickjacking." },
    ],
  },
  {
    title: 'Active Directory — Bases',
    category: SkillCategory.active_directory,
    questions: [
      { prompt: "Quel protocole d'authentification est utilisé nativement dans un domaine Active Directory ?", choices: ['OAuth2', 'Kerberos', 'SAML', 'RADIUS'], correctIndex: 1, explanation: "Kerberos est le protocole d'authentification par défaut dans un environnement Active Directory." },
      { prompt: 'Que signifie l\'acronyme GPO ?', choices: ['Global Process Object', 'Group Policy Object', 'General Permission Order', 'Grouped Public Object'], correctIndex: 1, explanation: 'Une GPO (Group Policy Object) définit des règles de configuration appliquées aux utilisateurs/ordinateurs du domaine.' },
      { prompt: 'Quel outil sert à cartographier les relations de confiance dans un AD ?', choices: ['Wireshark', 'BloodHound', 'Nmap', 'Burp Suite'], correctIndex: 1, explanation: "BloodHound visualise les relations et chemins d'attaque possibles au sein d'un domaine Active Directory." },
    ],
  },
]

export async function seedManualContent() {
  console.log('Seeding CTF categories, competitions, certifications, quizzes...')

  for (const c of ctfCategories) {
    await prisma.ctfCategory.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    })
  }

  await prisma.ctfCompetition.deleteMany()
  await prisma.ctfCompetition.createMany({ data: ctfCompetitions })

  for (const c of certifications) {
    await prisma.certification.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    })
  }

  for (const q of quizzes) {
    const existing = await prisma.quiz.findFirst({ where: { title: q.title } })
    const quizId = existing
      ? existing.id
      : (await prisma.quiz.create({ data: { title: q.title, category: q.category } })).id

    await prisma.quizQuestion.deleteMany({ where: { quizId } })
    await prisma.quizQuestion.createMany({
      data: q.questions.map((question) => ({ ...question, quizId })),
    })
  }

  console.log(`Seeded ${ctfCategories.length} CTF categories, ${ctfCompetitions.length} competitions, ${certifications.length} certifications, ${quizzes.length} quizzes.`)
}
