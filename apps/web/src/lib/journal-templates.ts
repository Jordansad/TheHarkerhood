import type { JournalEntryType } from '@hackerhood/types'

export const JOURNAL_TYPE_LABEL: Record<JournalEntryType, string> = {
  note: 'Note libre',
  writeup: 'Write-up CTF/HTB',
  pentest_report: 'Rapport de pentest',
  incident_report: "Rapport d'incident",
  daily: 'Entrée quotidienne',
}

export const JOURNAL_TEMPLATES: Record<JournalEntryType, string> = {
  note: '',
  writeup: `## Informations
- Plateforme : HTB / TryHackMe / CTF
- Difficulté : Easy / Medium / Hard
- Catégories : Web, Network, Crypto...
- Date de résolution : JJ/MM/AAAA

## Reconnaissance
- Scan Nmap, énumération, découvertes

## Exploitation
- Vulnérabilité identifiée, exploit utilisé
- Commandes exactes avec output

## Privilege Escalation (si applicable)

## Flags
- User.txt : ****
- Root.txt : ****

## Leçons apprises

## Ressources utilisées
`,
  pentest_report: `## Page de garde
Titre, client, date, classification, version

## Résumé exécutif
Vue d'ensemble pour les non-techniciens, risque global

## Périmètre & Méthodologie
IP/domaines testés, méthodo (PTES/OWASP), durée

## Résultats — Critique
Vulnérabilités critiques avec preuve (screenshot, PoC)

## Résultats — Haut
Vulnérabilités hautes avec preuve

## Résultats — Moyen/Faible
Vulnérabilités moyennes et faibles

## Recommandations
Plan de remédiation priorisé pour chaque finding

## Annexes
Logs complets, captures, outils utilisés, glossaire
`,
  incident_report: `## Identification
Date/heure de détection, systèmes impactés, source

## Analyse
Timeline des événements, IOCs, vecteur d'attaque

## Containment
Actions immédiates prises pour stopper la propagation

## Eradication
Suppression de la menace, nettoyage des systèmes

## Recovery
Restauration des services, validation de l'intégrité

## Lessons Learned
Ce qui a fonctionné, ce qu'il faut améliorer

## Recommandations
Actions à long terme pour éviter la récidive
`,
  daily: `Durée de travail : X heures

Activités réalisées :
-

Nouveaux concepts appris :
-

Blocages rencontrés :
-

Solutions trouvées :
-

Prochaines étapes :
-

Ressources utiles :
-
`,
}
