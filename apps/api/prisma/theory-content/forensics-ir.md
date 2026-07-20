Quand une intrusion est détectée (ou suspectée), la réponse à incident (Incident Response, IR) et l'analyse forensique déterminent ce qui s'est passé, l'étendue des dégâts, et comment l'attaquant est entré. C'est la suite logique du cours Blue Team : la détection déclenche l'alerte, la forensique répond aux questions.

## Objectifs

- Connaître les 6 phases du cycle de réponse à incident
- Comprendre l'ordre de volatilité et pourquoi il dicte l'ordre de collecte des preuves
- Savoir où chercher les traces d'une compromission sur un système

## Les 6 phases de la réponse à incident

1. **Préparation** : avant tout incident — plans de réponse écrits, outils prêts, équipe formée.
2. **Identification** : détecter qu'un incident est en cours (alertes SOC, signalement utilisateur, comportement anormal).
3. **Confinement** : isoler la menace pour l'empêcher de se propager — isoler une machine du réseau, désactiver un compte compromis, sans nécessairement tout éteindre (voir plus bas).
4. **Éradication** : supprimer la cause racine — malware, compte créé par l'attaquant, backdoor.
5. **Récupération** : remettre les systèmes en production en toute confiance, avec surveillance renforcée.
6. **Leçons apprises** : post-mortem — comment l'attaquant est entré, ce qui a (ou n'a pas) fonctionné dans la détection, quoi améliorer.

Le confinement rapide est souvent le facteur le plus déterminant dans l'impact final d'un incident — chaque minute où un attaquant reste actif sur le réseau augmente le risque d'exfiltration de données ou de propagation latérale.

## L'ordre de volatilité

Principe fondamental de la forensique : certaines preuves disparaissent plus vite que d'autres, et doivent donc être collectées en premier. Du plus volatile au moins volatile :

1. Registres CPU, cache
2. **Mémoire vive (RAM)** — disparaît intégralement à l'extinction, contient souvent des clés de déchiffrement, des processus malveillants en mémoire, des connexions réseau actives
3. État réseau (connexions actives, tables ARP)
4. Processus en cours d'exécution
5. Disque dur / stockage persistant
6. Logs distants, sauvegardes

**Ne jamais éteindre une machine compromise sans avoir capturé la mémoire** si une analyse forensique est prévue — c'est l'erreur la plus commune et la plus coûteuse : éteindre "pour être sûr" détruit irrémédiablement les preuves en RAM, alors qu'un confinement réseau (débrancher le câble, isoler le VLAN) préserve la machine allumée tout en stoppant la propagation.

```bash
# Capture mémoire (exemple avec un outil comme LiME sous Linux)
# puis analyse hors ligne avec Volatility pour extraire processus, connexions, artefacts en mémoire
volatility -f memdump.raw --profile=LinuxUbuntu imageinfo
```

## Chaîne de possession (chain of custody)

Chaque preuve collectée doit être documentée : qui l'a collectée, quand, comment, où elle a été stockée depuis. Sans cette traçabilité, une preuve peut être contestée (question de son intégrité) — critique si l'incident mène à des poursuites judiciaires, mais aussi simplement une bonne pratique pour garantir que l'analyse elle-même reste fiable.

## Où chercher les traces d'une compromission

- **Logs d'authentification** : connexions à des heures inhabituelles, depuis des IPs inconnues, échecs répétés (voir cours Blue Team — SOC Basics pour les Event IDs précis)
- **Processus et connexions réseau actifs** : un processus au nom suspect, une connexion sortante vers une IP inconnue sur un port inhabituel
- **Persistance** : tâches planifiées ajoutées, clés de registre de démarrage automatique (`Run`/`RunOnce` sous Windows), nouveaux services, comptes utilisateurs créés
- **Fichiers modifiés récemment** : `find / -mtime -1` (Linux) liste les fichiers modifiés dans les dernières 24h — un point de départ rapide pour repérer une activité récente suspecte
- **Historique de commandes** : souvent riche en informations si l'attaquant n'a pas pris soin de l'effacer

## Timeline : reconstituer la séquence des événements

Une fois les indices collectés, les replacer sur une ligne temporelle précise permet de répondre aux questions clés : quand l'attaquant est-il entré (point d'entrée initial) ? Qu'a-t-il fait ensuite (mouvement latéral, escalade) ? Quelles données a-t-il pu exfiltrer ? Des outils comme **Timesketch** ou une simple feuille de calcul triée par horodatage suffisent souvent pour un premier travail de corrélation.

## Pièges fréquents

- Éteindre immédiatement une machine compromise "par précaution" — détruit la mémoire volatile, souvent la source de preuve la plus riche.
- Travailler directement sur les preuves originales plutôt que sur une copie — risque d'altérer des métadonnées critiques (dates de modification, par exemple).
- Se concentrer uniquement sur "comment l'attaquant est entré" et négliger "qu'a-t-il fait après" — l'étendue réelle du compromis (mouvement latéral, autres comptes touchés) est souvent sous-estimée.

## Pour le lab

**CyberDefenders** propose des cas d'investigation complets (images mémoire, captures réseau, logs) à analyser de bout en bout, suivant exactement cette méthodologie : ordre de volatilité, reconstruction de timeline, identification du point d'entrée.
