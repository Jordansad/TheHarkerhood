Le bug bounty consiste à trouver et signaler des vulnérabilités à des entreprises via des programmes officiels, en échange d'une récompense (souvent financière). C'est la transition naturelle une fois les compétences techniques des modules précédents acquises : appliquer cette méthodologie sur des cibles réelles, dans un cadre strictement légal.

## Objectifs

- Comprendre le fonctionnement d'un programme de bug bounty et son scope
- Construire une méthodologie de reconnaissance et de test reproductible
- Rédiger un rapport de vulnérabilité qui sera effectivement pris au sérieux

## Fonctionnement d'un programme

Une entreprise publie un programme sur une plateforme (**HackerOne**, **Bugcrowd**, ou en direct) définissant :

- Le **scope** : quels domaines, applications, ou systèmes peuvent être testés — tester en dehors du scope est illégal, même avec de bonnes intentions
- Les **règles d'engagement** : types de tests autorisés (le DoS est presque toujours interdit, l'ingénierie sociale souvent aussi)
- Le **barème de récompenses**, généralement par niveau de sévérité (critique, élevé, moyen, faible)

Lire intégralement la politique du programme avant de commencer n'est pas optionnel : sortir du scope, même par erreur, peut entraîner une exclusion du programme voire des conséquences légales.

## Méthodologie de reconnaissance pour le bug bounty

Le bug bounty récompense la couverture et la profondeur bien plus que la vitesse — une méthodologie reproductible et exhaustive rapporte davantage qu'une série de tests ad hoc :

1. **Reconnaissance passive** : énumération de sous-domaines (revois le cours OSINT Avancé), recherche de technologies utilisées, historique de code sur GitHub public
2. **Cartographie de la surface active** : quelles applications répondent réellement sur les sous-domaines trouvés, quels endpoints API sont exposés
3. **Test méthodique par catégorie** : reprendre systématiquement chaque classe de vulnérabilité vue dans la roadmap (injection, contrôle d'accès, BOLA sur les API, XSS...) sur chaque surface identifiée
4. **Documentation au fil de l'eau** : noter chaque tentative, même infructueuse — évite de retester deux fois la même chose, et sert de base au rapport final

## Où chercher ce que les autres ratent

Les cibles les plus évidentes (page de login principale, formulaire de contact) sont aussi les plus testées par tous les autres chasseurs. Les zones souvent sous-explorées :

- **Sous-domaines oubliés** : environnements de staging, anciennes versions d'API encore actives, outils internes accidentellement exposés
- **Fonctionnalités récemment ajoutées** : moins testées que le cœur historique de l'application, souvent annoncées dans un changelog public
- **Logique métier** : les scanners automatiques détectent bien l'injection ou le XSS, beaucoup moins les failures de logique (contourner une étape de paiement, modifier un prix côté client, abuser d'un système de coupon)

## Rédiger un rapport pris au sérieux

Un rapport de bug bounty suit une structure proche du write-up déjà vu dans le cours Git & Documentation, avec des exigences spécifiques :

```markdown
## Titre
Description en une ligne, précise (pas "XSS trouvé" mais "XSS stocké dans le champ
commentaire du profil, exécutable par tout visiteur du profil")

## Sévérité estimée
Selon CVSS ou le barème du programme

## Étapes de reproduction
Numérotées, précises, reproductibles par quelqu'un qui ne connaît pas l'application

## Impact
Ce qu'un attaquant réel pourrait faire avec cette vulnérabilité, concrètement

## Preuve de concept (PoC)
Capture d'écran, requête HTTP exacte, ou vidéo courte
```

Un rapport vague ("il y a une faille de sécurité") ou non reproductible est systématiquement rejeté ou fortement déprécié, quelle que soit la gravité réelle du problème trouvé — la clarté du rapport compte presque autant que la vulnérabilité elle-même.

## Duplicatas et gestion de la frustration

Une part significative des rapports soumis en bug bounty sont des **doublons** (quelqu'un d'autre a trouvé la même chose avant, parfois quelques minutes avant) — c'est un aspect normal et statistiquement inévitable de l'activité, pas un signe d'incompétence. La constance et la couverture méthodique sur la durée comptent plus que le gain isolé d'un seul rapport chanceux.

## Pièges fréquents

- Tester hors du scope défini, même une propriété qui "semble" liée à l'entreprise — vérifier systématiquement l'inclusion explicite avant de tester quoi que ce soit.
- Soumettre un rapport sans étapes de reproduction claires — le triage le rejettera ou demandera des clarifications, retardant (ou annulant) la récompense.
- Se décourager après plusieurs duplicatas consécutifs — la persistance méthodique, pas la chance isolée, distingue les chasseurs qui progressent sur la durée.

## Pour le lab

Commence sur des programmes **HackerOne** ou **Bugcrowd** avec un scope large et une politique claire pour débutants, en appliquant systématiquement la méthodologie de reconnaissance en 4 étapes ci-dessus avant tout test actif.
