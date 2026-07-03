import { MethodologyCategory } from '@prisma/client'
import { prisma } from '../src/lib/prisma'

interface MethodologySeed {
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
  steps: { title: string; description: string }[]
}

const methodologies: MethodologySeed[] = [
  {
    slug: 'pentest-web',
    title: 'Pentest Web',
    category: MethodologyCategory.web,
    objective: "Identifier et documenter les vulnérabilités d'une application web dans un cadre autorisé, avant qu'un attaquant ne les exploite.",
    preparation: "Périmètre écrit (domaines/IPs autorisés), autorisation signée, fenêtre de test convenue, comptes de test fournis si l'application est authentifiée.",
    tools: ['Burp Suite', 'OWASP ZAP', 'Nmap', 'ffuf / gobuster', 'sqlmap (usage autorisé uniquement)'],
    bestPractices: "Respecter le scope strictement, versionner les preuves (captures, requêtes brutes), limiter le taux de requêtes pour éviter tout déni de service, chiffrer les rapports.",
    commonMistakes: "Sortir du scope, tester en heures de forte charge sans accord, ne pas documenter au fur et à mesure, oublier de nettoyer les comptes de test créés.",
    deliverables: "Rapport avec score CVSS par vulnérabilité, preuve de concept pour chaque finding, recommandations de remédiation priorisées.",
    position: 1,
    steps: [
      { title: 'Valider le périmètre et l\'autorisation écrite', description: "Confirmer par écrit les domaines/IPs, les exclusions et la fenêtre de test avant toute action." },
      { title: 'Reconnaissance passive', description: 'OSINT, sous-domaines, technologies utilisées, sans interagir directement avec la cible.' },
      { title: "Cartographie de l'application", description: 'Lister les pages, endpoints, paramètres et flux fonctionnels.' },
      { title: 'Analyse authentification et sessions', description: 'Politique de mot de passe, gestion des tokens/cookies, expiration de session.' },
      { title: "Test du contrôle d'accès", description: 'Recherche d\'IDOR et de possibilités d\'élévation de privilèges horizontale/verticale.' },
      { title: 'Test des injections', description: 'SQL, commande, template — uniquement dans le périmètre autorisé.' },
      { title: 'Test XSS/CSRF et en-têtes HTTP', description: 'Vérifier la présence et la configuration des en-têtes de sécurité.' },
      { title: 'Configuration serveur', description: "Vérifier l'exposition d'informations sensibles (versions, fichiers de debug, backups)." },
      { title: 'Rédaction du rapport', description: 'Prioriser les findings par sévérité et impact métier.' },
      { title: 'Restitution et retest', description: 'Présenter les résultats et vérifier les correctifs après remédiation.' },
    ],
  },
  {
    slug: 'pentest-interne',
    title: 'Pentest Interne',
    category: MethodologyCategory.internal,
    objective: "Évaluer la résistance du réseau interne face à un attaquant disposant déjà d'un point d'accès (poste compromis, accès physique, etc.).",
    preparation: "Accès réseau fourni (VPN ou poste dédié), règles d'engagement définies, contact d'urgence en cas d'incident réel détecté.",
    tools: ['Nmap', 'BloodHound', 'CrackMapExec', 'Wireshark', 'Responder (analyse uniquement)'],
    bestPractices: "Cartographier avant d'agir, éviter toute action destructive, coordonner avec les équipes réseau/SOC pendant le test.",
    commonMistakes: "Scanner agressivement sans prévenir les équipes, ignorer les segments hors scope, ne pas journaliser ses actions.",
    deliverables: "Chemins d'attaque documentés, chemins critiques vers les comptes à privilèges, recommandations de segmentation.",
    position: 2,
    steps: [
      { title: "Confirmer le point d'accès initial", description: 'Valider le périmètre réseau et les segments autorisés.' },
      { title: 'Découverte réseau', description: 'Inventaire des hôtes et services actifs.' },
      { title: 'Énumération des partages', description: 'Recherche de fichiers sensibles sur les partages accessibles.' },
      { title: 'Recherche de credentials exposés', description: 'Scripts, fichiers de configuration, GPO en clair.' },
      { title: 'Cartographie des relations de confiance', description: 'Utiliser BloodHound pour visualiser les chemins possibles.' },
      { title: 'Identification des chemins vers les comptes à privilèges', description: 'Prioriser les chemins les plus courts et les plus probables.' },
      { title: 'Test de la segmentation réseau', description: 'Vérifier l\'étanchéité entre zones (utilisateurs, serveurs, admin).' },
      { title: 'Documentation des chemins de compromission', description: 'Schématiser chaque chemin découvert avec les preuves associées.' },
      { title: 'Rapport et priorisation', description: 'Classer les risques par impact et probabilité.' },
    ],
  },
  {
    slug: 'pentest-active-directory',
    title: 'Pentest Active Directory',
    category: MethodologyCategory.active_directory,
    objective: "Identifier les faiblesses de configuration d'un domaine AD pouvant mener à une compromission complète du domaine.",
    preparation: "Compte de domaine standard fourni, accès réseau au contrôleur de domaine, autorisation explicite couvrant les tests AD.",
    tools: ['BloodHound', 'PowerView', 'Certipy (audit ADCS)', 'ldapsearch'],
    bestPractices: "Privilégier l'énumération avant toute action, faire attention au password spraying pour éviter les verrouillages de comptes, documenter chaque relation de confiance découverte.",
    commonMistakes: "Tester en dehors des heures convenues, provoquer des lockouts en masse, négliger l'audit des GPO et de l'infrastructure ADCS.",
    deliverables: "Graphe des chemins d'attaque, liste des mauvaises configurations (ACL, délégations, ADCS), plan de durcissement.",
    position: 3,
    steps: [
      { title: 'Valider les comptes de test', description: "Confirmer l'accès au domaine avec un compte standard." },
      { title: 'Énumération utilisateurs/groupes/OUs', description: 'Cartographier la structure du domaine.' },
      { title: 'Analyse des relations de confiance', description: 'Utiliser BloodHound pour identifier les chemins d\'attaque.' },
      { title: 'Audit des délégations Kerberos', description: 'Rechercher les délégations non contraintes ou mal configurées.' },
      { title: 'Recherche de configurations ADCS vulnérables', description: 'Vérifier les templates de certificats mal sécurisés.' },
      { title: 'Vérification des GPO et ACL', description: 'Identifier les permissions excessives sur les objets du domaine.' },
      { title: 'Recherche de comptes à privilèges mal protégés', description: 'Comptes de service, admins avec SPN exposés, etc.' },
      { title: 'Documentation des chemins vers Domain Admin', description: 'Prioriser les chemins les plus courts et fiables.' },
      { title: 'Rapport et recommandations', description: 'Prioriser les corrections selon leur impact sur la sécurité du domaine.' },
    ],
  },
  {
    slug: 'audit-wifi',
    title: 'Audit WiFi',
    category: MethodologyCategory.wifi,
    objective: "Évaluer la sécurité des réseaux sans fil : chiffrement, authentification, points d'accès non autorisés.",
    preparation: "Autorisation écrite couvrant les fréquences et zones physiques testées, matériel adapté (carte réseau compatible mode monitor).",
    tools: ['Suite aircrack-ng', 'Wireshark', 'Kismet'],
    bestPractices: "Rester strictement dans le périmètre physique autorisé, éviter d'interférer avec des réseaux tiers, documenter tous les SSID détectés.",
    commonMistakes: "Capturer du trafic hors périmètre, tester sur des réseaux voisins non autorisés, négliger l'audit du réseau invité.",
    deliverables: "Inventaire des réseaux et de leur niveau de chiffrement, points d'accès non autorisés détectés, recommandations de durcissement.",
    position: 4,
    steps: [
      { title: 'Valider le périmètre physique', description: 'Confirmer les zones et fréquences couvertes par l\'autorisation.' },
      { title: 'Cartographie des réseaux visibles', description: 'Lister les SSID et leur type de chiffrement.' },
      { title: "Détection de points d'accès rogue", description: 'Rechercher des AP non autorisés ou mal configurés.' },
      { title: "Analyse du protocole d'authentification", description: 'Vérifier WPA2/WPA3 et la configuration EAP le cas échéant.' },
      { title: 'Test de robustesse des mots de passe', description: 'Uniquement dans le cadre explicitement autorisé.' },
      { title: "Vérification de l'isolation réseau invité/interne", description: 'Confirmer l\'étanchéité entre les deux réseaux.' },
      { title: 'Rapport et recommandations', description: 'Prioriser les corrections de configuration.' },
    ],
  },
  {
    slug: 'osint',
    title: 'OSINT',
    category: MethodologyCategory.osint,
    objective: "Collecter des informations publiquement accessibles sur une cible pour évaluer sa surface d'exposition.",
    preparation: "Définir le périmètre (domaines, entreprise, personnes autorisées), respecter le cadre légal (RGPD).",
    tools: ['theHarvester', 'Shodan', 'Google dorking', 'whois', 'Réseaux sociaux'],
    bestPractices: "Ne collecter que des informations publiques, anonymiser les données sensibles dans le rapport, croiser systématiquement les sources.",
    commonMistakes: "Franchir la limite entre collecte passive et intrusion, négliger la vérification des informations, exposer inutilement des données personnelles dans le rapport.",
    deliverables: "Cartographie de la surface d'attaque (domaines, emails, technologies, employés exposés), recommandations de réduction d'exposition.",
    position: 5,
    steps: [
      { title: 'Définir le périmètre et les contraintes légales', description: 'Clarifier ce qui est autorisé à collecter et documenter.' },
      { title: 'Reconnaissance des domaines et sous-domaines', description: 'Cartographier l\'infrastructure exposée publiquement.' },
      { title: 'Recherche sur les employés', description: 'Réseaux sociaux, fuites de données publiques.' },
      { title: 'Identification des technologies utilisées', description: 'Via Shodan, en-têtes HTTP, métadonnées.' },
      { title: 'Recherche de documents et métadonnées exposés', description: 'Fichiers publics, PDF, images avec métadonnées.' },
      { title: 'Vérification des fuites de données connues', description: 'Croiser avec des bases de fuites publiques.' },
      { title: "Rapport de surface d'exposition", description: 'Synthétiser et prioriser les réductions recommandées.' },
    ],
  },
  {
    slug: 'ctf',
    title: 'CTF — Méthodologie générale',
    category: MethodologyCategory.ctf,
    objective: "Aborder efficacement une compétition CTF (Jeopardy ou Attack-Defense), seul ou en équipe.",
    preparation: "Environnement de travail prêt (VM, outils par catégorie), répartition des rôles en équipe, canal de communication dédié.",
    tools: ['Kali Linux / ParrotOS', 'CyberChef', 'Ghidra', 'Burp Suite selon les catégories'],
    bestPractices: "Trier les challenges par points/difficulté, documenter chaque piste explorée, partager rapidement les découvertes en équipe.",
    commonMistakes: "S'acharner seul sur un challenge bloqué au lieu de changer, ne pas sauvegarder sa progression, négliger les indices disponibles.",
    deliverables: "Writeups des challenges résolus, notes réutilisables pour les prochaines compétitions.",
    position: 6,
    steps: [
      { title: 'Lire toutes les descriptions de challenges', description: 'Trier par catégorie et par nombre de points.' },
      { title: 'Préparer son environnement', description: 'Outils prêts par catégorie avant le début du CTF.' },
      { title: 'Prioriser les challenges', description: 'Selon le rapport effort/points estimé.' },
      { title: 'Documenter chaque piste', description: 'Noter les résultats au fur et à mesure, même les échecs.' },
      { title: 'Utiliser les indices si bloqué', description: 'Éviter de perdre trop de temps sur un seul challenge.' },
      { title: 'Partager les découvertes en équipe', description: 'Communiquer rapidement pour éviter les doublons de travail.' },
      { title: 'Rédiger les writeups', description: 'Après la compétition, pour capitaliser sur les apprentissages.' },
    ],
  },
  {
    slug: 'bug-bounty',
    title: 'Bug Bounty',
    category: MethodologyCategory.bug_bounty,
    objective: "Identifier des vulnérabilités dans le cadre d'un programme de bug bounty et les rapporter de façon responsable.",
    preparation: "Lire attentivement la politique du programme (scope, exclusions, récompenses), créer un compte sur la plateforme (HackerOne, Bugcrowd...).",
    tools: ['Burp Suite', 'subfinder / amass', 'httpx', 'nuclei (templates publics)'],
    bestPractices: "Respecter scrupuleusement le scope et les règles du programme, soumettre des rapports clairs avec une preuve de concept minimale, ne jamais exploiter au-delà de la preuve.",
    commonMistakes: "Tester hors scope, soumettre un doublon sans vérifier au préalable, exagérer la sévérité, divulguer publiquement avant accord du programme.",
    deliverables: "Rapport de vulnérabilité clair : résumé, impact, preuve de concept, remédiation suggérée.",
    position: 7,
    steps: [
      { title: 'Lire la politique du programme', description: 'Définir précisément le scope et les exclusions.' },
      { title: 'Reconnaissance approfondie', description: 'Uniquement sur le périmètre autorisé par le programme.' },
      { title: 'Recherche de vulnérabilités', description: 'Configurations faibles, vulnérabilités connues, logique métier.' },
      { title: 'Validation et documentation', description: 'Chaque découverte doit être reproductible et documentée.' },
      { title: "Vérification qu'il ne s'agit pas d'un doublon", description: 'Rechercher dans les rapports publics déjà soumis si possible.' },
      { title: 'Rédaction du rapport', description: 'Clair, avec preuve de concept minimale et impact expliqué.' },
      { title: 'Soumission et suivi', description: 'Rester disponible pour les questions de l\'équipe sécurité.' },
    ],
  },
]

export async function seedMethodologies() {
  console.log('Seeding methodologies...')

  for (const m of methodologies) {
    const created = await prisma.methodology.upsert({
      where: { slug: m.slug },
      update: {
        title: m.title,
        category: m.category,
        objective: m.objective,
        preparation: m.preparation,
        tools: m.tools,
        bestPractices: m.bestPractices,
        commonMistakes: m.commonMistakes,
        deliverables: m.deliverables,
        position: m.position,
      },
      create: {
        slug: m.slug,
        title: m.title,
        category: m.category,
        objective: m.objective,
        preparation: m.preparation,
        tools: m.tools,
        bestPractices: m.bestPractices,
        commonMistakes: m.commonMistakes,
        deliverables: m.deliverables,
        position: m.position,
      },
    })

    await prisma.methodologyStep.deleteMany({ where: { methodologyId: created.id } })
    await prisma.methodologyStep.createMany({
      data: m.steps.map((s, i) => ({
        methodologyId: created.id,
        order: i + 1,
        title: s.title,
        description: s.description,
      })),
    })
  }

  console.log(`Seeded ${methodologies.length} methodologies.`)
}
