L'OSINT (Open Source Intelligence) consiste à collecter et recouper de l'information exclusivement à partir de sources publiques. C'est souvent la toute première étape d'un engagement de pentest (avant même le premier scan Nmap) et un pilier entier de la cybersécurité défensive (threat intelligence) et du bug bounty.

## Objectifs

- Structurer une méthodologie de reconnaissance OSINT (du large au précis)
- Utiliser les techniques d'énumération de sous-domaines et de recherche avancée
- Comprendre les limites légales et éthiques de l'OSINT

## Pourquoi l'OSINT avant tout scan technique

Avant d'envoyer le moindre paquet vers une cible, l'OSINT permet de comprendre son périmètre : quels domaines et sous-domaines lui appartiennent, quelles technologies elle utilise, qui sont ses employés, quelles fuites de données publiques la concernent déjà. Cette information oriente toute la suite de l'engagement — inutile de scanner à l'aveugle ce qu'on peut déjà savoir par une recherche publique.

## Énumération de sous-domaines

Une organisation expose rarement un seul domaine — retrouver ses sous-domaines élargit considérablement la surface d'attaque identifiée :

```bash
# Recherche passive (sans interroger directement la cible) via des bases de certificats SSL publiques
curl -s "https://crt.sh/?q=%.example.com&output=json" | jq -r '.[].name_value' | sort -u

# Outils dédiés à l'automatisation de cette recherche
subfinder -d example.com
amass enum -d example.com
```

`crt.sh` interroge les logs publics de certificats **Certificate Transparency** — chaque certificat SSL émis pour un sous-domaine y est enregistré publiquement, ce qui en fait une source d'énumération passive extrêmement fiable et totalement invisible pour la cible (aucune requête n'atteint directement ses serveurs).

## Google dorking

Les opérateurs de recherche avancée Google (et autres moteurs) permettent de cibler des résultats très spécifiques :

```
site:example.com filetype:pdf                 # documents PDF publics sur ce domaine
site:example.com inurl:admin                   # pages contenant "admin" dans l'URL
site:example.com intitle:"index of"             # dossiers avec listing de répertoire ouvert
"example.com" -site:example.com filetype:xlsx   # fichiers Excel mentionnant le domaine, ailleurs
```

Ces recherches révèlent régulièrement des documents internes indexés par erreur, des interfaces d'administration non censées être publiques, ou des informations sensibles laissées accessibles — sans jamais interagir directement avec les serveurs de la cible.

## Métadonnées de documents

Les fichiers publics (PDF, Word, images) contiennent souvent des métadonnées révélatrices : nom de l'auteur, logiciel utilisé, parfois un chemin de fichier interne complet. L'outil **exiftool** extrait ces métadonnées :

```bash
exiftool document.pdf
```

Recouper plusieurs noms d'auteurs trouvés dans des documents publics permet souvent de reconstruire une partie de l'organigramme d'une entreprise — utile en préparation d'un test de phishing ciblé (dans un cadre autorisé), ou pour de la threat intelligence.

## Réseaux sociaux et fuites de données

LinkedIn révèle la structure organisationnelle et les technologies utilisées (via les intitulés de poste : "Ingénieur DevOps AWS" révèle l'usage d'AWS). Les bases de fuites de données publiques (Have I Been Pwned pour vérifier si des emails ont fuité, DeHashed pour rechercher des identifiants compromis) permettent d'évaluer si des credentials d'employés circulent déjà — une information critique pour évaluer le risque de credential stuffing (revois le cours Password Attacks).

## Cadre légal et éthique

L'OSINT porte sur de l'information **publique**, mais "public" ne signifie pas "sans limite d'usage" :

- Rester dans le périmètre autorisé d'une mission — l'OSINT n'échappe pas au cadre légal du reste du pentest
- Ne jamais utiliser l'information collectée pour du harcèlement, de l'usurpation d'identité, ou toute action au-delà de l'objectif défensif/offensif autorisé
- Documenter précisément les sources — la traçabilité fait partie de la rigueur professionnelle attendue dans un rapport

## Pièges fréquents

- Se limiter à Google et ignorer les sources spécialisées (crt.sh, Shodan, bases de fuites) qui révèlent bien plus d'information technique exploitable.
- Considérer l'OSINT comme une étape secondaire alors qu'elle oriente souvent tout le reste de l'engagement.
- Franchir la ligne entre collecte passive légitime et interaction active non autorisée avec des systèmes tiers (un scan Shodan est passif ; se connecter directement à un service découvert sans autorisation ne l'est plus).

## Pour le lab

Pratique l'énumération de sous-domaines et le Google dorking sur un domaine dont tu es propriétaire ou explicitement autorisé à tester — recoupe les résultats de crt.sh, d'un outil comme Amass, et de recherches manuelles pour construire une cartographie complète.
