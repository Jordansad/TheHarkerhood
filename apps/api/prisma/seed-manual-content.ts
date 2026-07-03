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
  {
    title: 'Windows — Bases',
    category: SkillCategory.windows,
    questions: [
      { prompt: "Quelle console permet d'exécuter des scripts d'administration Windows avancés ?", choices: ['CMD', 'PowerShell', 'Regedit', 'Explorer'], correctIndex: 1, explanation: 'PowerShell est le shell orienté objet permettant automatisation et administration avancée de Windows.' },
      { prompt: "Où sont stockées les définitions de permissions sur un fichier Windows (NTFS) ?", choices: ['Le registre', "L'ACL (liste de contrôle d'accès)", 'Le fichier hosts', 'Le MBR'], correctIndex: 1, explanation: "Les permissions NTFS sont définies via une ACL (Access Control List) attachée à chaque objet." },
      { prompt: 'Quelle base de données centralise la configuration système Windows ?', choices: ['Le registre (Registry)', '/etc/passwd', 'Active Directory uniquement', 'Le Panneau de configuration'], correctIndex: 0, explanation: 'Le registre Windows stocke la configuration système, matérielle et logicielle sous forme de clés/valeurs.' },
    ],
  },
  {
    title: 'Scripting — Bash & Python',
    category: SkillCategory.scripting,
    questions: [
      { prompt: 'En Bash, quelle structure permet de répéter une action tant qu\'une condition est vraie ?', choices: ['if', 'while', 'case', 'function'], correctIndex: 1, explanation: 'La boucle `while` exécute un bloc tant que sa condition reste vraie.' },
      { prompt: "En Python, quel module standard permet de faire des requêtes HTTP ?", choices: ['os', 'socket bas niveau uniquement', 'requests (tiers) ou urllib (standard)', 'sys'], correctIndex: 2, explanation: 'requests (bibliothèque tierce très populaire) ou urllib (module standard) permettent de faire des requêtes HTTP en Python.' },
      { prompt: 'Quel symbole Bash redirige la sortie standard vers un fichier en écrasant son contenu ?', choices: ['>>', '>', '|', '<'], correctIndex: 1, explanation: '`>` redirige et écrase ; `>>` redirige en ajoutant à la fin du fichier.' },
    ],
  },
  {
    title: 'Élévation de privilèges',
    category: SkillCategory.privesc,
    questions: [
      { prompt: 'Que permet un binaire avec le bit SUID activé sous Linux ?', choices: ["Il s'exécute avec les droits du propriétaire du fichier", "Il devient illisible", 'Il se supprime après exécution', "Il ne peut plus être modifié"], correctIndex: 0, explanation: 'Le bit SUID fait exécuter le binaire avec les privilèges de son propriétaire (souvent root), ce qui peut être abusé si mal configuré.' },
      { prompt: 'Quel fichier liste les commandes qu\'un utilisateur peut exécuter en tant que root sous Linux ?', choices: ['/etc/sudoers', '/etc/passwd', '/etc/shadow', '/etc/crontab'], correctIndex: 0, explanation: '/etc/sudoers définit les règles de qui peut utiliser sudo et avec quelles restrictions.' },
      { prompt: 'Sous Windows, quel privilège mal configuré peut permettre une élévation via un service ?', choices: ['Un mot de passe faible', 'Des permissions excessives sur le binaire du service', 'Un pare-feu désactivé', 'Un thème sombre activé'], correctIndex: 1, explanation: "Si un utilisateur non-admin peut modifier le binaire ou la configuration d'un service qui s'exécute en tant que SYSTEM, il peut en abuser pour élever ses privilèges." },
    ],
  },
  {
    title: 'OSINT — Techniques',
    category: SkillCategory.osint,
    questions: [
      { prompt: "Qu'est-ce qu'un 'Google dork' ?", choices: ['Un virus', 'Une requête de recherche avancée utilisant des opérateurs spécifiques', 'Un type de pare-feu', 'Un outil de brute-force'], correctIndex: 1, explanation: "Un Google dork utilise des opérateurs de recherche avancés (site:, filetype:, intitle:...) pour trouver des informations spécifiques exposées publiquement." },
      { prompt: 'Quel outil permet de découvrir des services et appareils exposés sur Internet ?', choices: ['Shodan', 'Photoshop', 'Excel', 'Notepad++'], correctIndex: 0, explanation: 'Shodan indexe les appareils et services connectés à Internet, très utilisé en reconnaissance OSINT.' },
      { prompt: "Pourquoi vérifier les métadonnées d'un document ou d'une image en OSINT ?", choices: ["Elles n'ont aucune utilité", 'Elles peuvent révéler auteur, logiciel, position GPS ou date de création', 'Elles ralentissent le fichier', "Elles chiffrent le contenu"], correctIndex: 1, explanation: "Les métadonnées (EXIF pour les images, propriétés de document) peuvent exposer des informations sensibles non visibles directement." },
    ],
  },
  {
    title: 'Exploitation — Concepts',
    category: SkillCategory.exploitation,
    questions: [
      { prompt: "Dans Metasploit, qu'est-ce qu'un 'payload' ?", choices: ['Le rapport final du test', 'Le code exécuté sur la cible après exploitation réussie', 'Le scanner de ports', "Le firewall de la cible"], correctIndex: 1, explanation: "Le payload est le code qui s'exécute sur le système cible une fois l'exploit réussi (ex: reverse shell, meterpreter)." },
      { prompt: "Qu'est-ce qu'un 'reverse shell' ?", choices: ["Un shell qui s'auto-détruit", 'Une connexion initiée par la machine compromise vers l\'attaquant', 'Un antivirus', 'Un shell en lecture seule'], correctIndex: 1, explanation: "Un reverse shell fait en sorte que la machine cible initie la connexion vers l'attaquant, contournant souvent les restrictions de pare-feu entrant." },
      { prompt: "Que signifie 'post-exploitation' ?", choices: ["La phase avant l'attaque", 'Les actions menées après avoir obtenu un accès initial (persistance, pivot, collecte)', 'La rédaction du rapport uniquement', "La sauvegarde du système"], correctIndex: 1, explanation: "La post-exploitation regroupe les actions réalisées après une compromission initiale : élévation de privilèges, persistance, mouvement latéral, exfiltration." },
    ],
  },
  {
    title: 'Blue Team & SOC',
    category: SkillCategory.blue_team,
    questions: [
      { prompt: 'Que signifie SIEM ?', choices: ['Security Information and Event Management', 'System Internal Encryption Module', 'Secure Internet Email Monitor', 'Server Identity and Endpoint Manager'], correctIndex: 0, explanation: "Un SIEM centralise, corrèle et alerte sur les événements de sécurité provenant de multiples sources." },
      { prompt: "Qu'est-ce que le 'triage' dans un SOC ?", choices: ["Supprimer tous les logs", 'Prioriser et qualifier rapidement les alertes selon leur criticité', 'Redémarrer les serveurs', 'Chiffrer le trafic'], correctIndex: 1, explanation: "Le triage consiste à évaluer rapidement chaque alerte pour déterminer sa gravité et décider des actions à mener." },
      { prompt: 'Quel référentiel est couramment utilisé pour cartographier les tactiques et techniques des attaquants ?', choices: ['OWASP Top 10', 'MITRE ATT&CK', 'CVSS', 'ISO 27001'], correctIndex: 1, explanation: "MITRE ATT&CK est une base de connaissances des tactiques, techniques et procédures (TTPs) utilisées par les attaquants, très utilisée en Blue Team." },
    ],
  },
  {
    title: 'Cloud Security',
    category: SkillCategory.cloud,
    questions: [
      { prompt: 'Que signifie IAM dans un contexte cloud ?', choices: ['Internet Access Manager', 'Identity and Access Management', 'Internal Application Monitor', 'Instance Availability Metric'], correctIndex: 1, explanation: "IAM (Identity and Access Management) gère les identités et permissions d'accès aux ressources cloud." },
      { prompt: "Quel est un risque fréquent lié aux buckets de stockage cloud (ex: S3) ?", choices: ['Ils sont toujours gratuits', 'Une mauvaise configuration peut les rendre publiquement accessibles', 'Ils ne peuvent pas contenir de fichiers', "Ils sont automatiquement chiffrés"], correctIndex: 1, explanation: "Une permission trop permissive (bucket public) est l'une des causes les plus fréquentes de fuite de données dans le cloud." },
      { prompt: "Quel principe de sécurité recommande de n'accorder que les permissions strictement nécessaires ?", choices: ['Défense en profondeur', 'Moindre privilège', 'Sécurité par l\'obscurité', 'Fail-open'], correctIndex: 1, explanation: "Le principe du moindre privilège limite chaque identité aux seules permissions nécessaires à sa fonction." },
    ],
  },
  {
    title: 'Reverse Engineering',
    category: SkillCategory.reverse_engineering,
    questions: [
      { prompt: "Quelle est la différence entre analyse statique et dynamique d'un binaire ?", choices: ["Il n'y a aucune différence", "La statique examine le code sans l'exécuter, la dynamique l'observe en cours d'exécution", 'La dynamique est toujours plus rapide', 'La statique nécessite un débogueur'], correctIndex: 1, explanation: "L'analyse statique étudie le binaire sans l'exécuter (désassemblage, strings), la dynamique observe son comportement réel à l'exécution (débogueur, tracer)." },
      { prompt: 'Quel outil est une référence gratuite pour la rétro-ingénierie de binaires ?', choices: ['Ghidra', 'Photoshop', 'Wireshark', 'Nmap'], correctIndex: 0, explanation: "Ghidra (NSA, open source) est un désassembleur/décompilateur très utilisé en reverse engineering." },
      { prompt: "Que permet un débogueur comme x64dbg ?", choices: ['Compiler du code source', "Exécuter le programme pas à pas et inspecter son état mémoire", 'Scanner un réseau', 'Chiffrer un fichier'], correctIndex: 1, explanation: "Un débogueur permet d'exécuter un programme instruction par instruction et d'observer/modifier son état (registres, mémoire)." },
    ],
  },
  {
    title: 'Analyse de malwares',
    category: SkillCategory.malware_analysis,
    questions: [
      { prompt: "Qu'est-ce qu'un IOC en analyse de malware ?", choices: ["Un indicateur de compromission (hash, IP, domaine...)", 'Un type de virus', 'Un antivirus', 'Un protocole réseau'], correctIndex: 0, explanation: "Un IOC (Indicator of Compromise) est un artefact observable indiquant une intrusion potentielle : hash de fichier, IP, domaine, clé de registre..." },
      { prompt: "Pourquoi analyser un malware dans un environnement sandboxé ?", choices: ["Pour le rendre plus rapide", "Pour observer son comportement sans risquer d'infecter le système réel", "Ce n'est jamais nécessaire", "Pour le compiler"], correctIndex: 1, explanation: "Une sandbox isole l'exécution du malware pour observer son comportement sans compromettre l'environnement de travail." },
      { prompt: "Que permettent les règles YARA ?", choices: ['Chiffrer des fichiers', 'Identifier et classifier des malwares selon des motifs définis', 'Scanner un réseau WiFi', 'Configurer un pare-feu'], correctIndex: 1, explanation: "YARA permet de définir des règles de détection basées sur des motifs (chaînes, structures) pour identifier des familles de malwares." },
    ],
  },
  {
    title: 'Sécurité API',
    category: SkillCategory.api_security,
    questions: [
      { prompt: "Quel est un risque classique du Top 10 OWASP API ?", choices: ['Broken Object Level Authorization (BOLA)', 'Trop de couleurs dans l\'interface', 'Police de caractère non lisible', 'Absence de favicon'], correctIndex: 0, explanation: "BOLA (accès à des objets d'autres utilisateurs via manipulation d'ID) est la vulnérabilité n°1 de l'OWASP API Top 10." },
      { prompt: 'Quel type de jeton est couramment utilisé pour authentifier les appels API modernes ?', choices: ['JWT (JSON Web Token)', 'Un simple mot de passe en clair dans l\'URL', 'Aucune authentification n\'est nécessaire', 'Un cookie de session uniquement'], correctIndex: 0, explanation: "Les JWT sont largement utilisés pour transmettre des informations d'authentification/autorisation de façon stateless entre client et API." },
      { prompt: "Pourquoi le rate limiting est-il important pour une API ?", choices: ["Il améliore le design visuel", 'Il protège contre les abus, le brute-force et le déni de service', "Il n'a aucun intérêt en sécurité", 'Il chiffre les données'], correctIndex: 1, explanation: "Le rate limiting limite le nombre de requêtes par client, protégeant contre le brute-force, le scraping abusif et certains DoS applicatifs." },
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
