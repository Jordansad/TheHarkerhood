Git n'est pas qu'un outil de développeur : c'est ta mémoire de travail en pentest (versionner tes scripts et notes) et le socle de ton portfolio public. La documentation — write-ups, rapports — est ce qui transforme un lab résolu en preuve de compétence.

## Objectifs

- Utiliser le cycle Git de base (init, add, commit, push, pull)
- Structurer un dépôt et un historique de commits lisible
- Rédiger un write-up clair après un lab ou un CTF

## Le cycle Git essentiel

```bash
git init                          # créer un nouveau dépôt local
git clone git@github.com:user/repo.git  # récupérer un dépôt existant

git status                        # voir ce qui a changé
git add fichier.py                # ou "git add ." pour tout ajouter
git commit -m "Ajoute le scanner de ports"
git push origin main               # envoyer vers GitHub
git pull                          # récupérer les changements distants
```

Un commit est un instantané de tes fichiers à un moment donné, avec un message qui explique **pourquoi** (pas juste "quoi") le changement a été fait. `git log --oneline` montre l'historique condensé.

## Les trois zones de Git

Comprendre ce schéma évite 90% de la confusion des débutants :

1. **Working directory** — tes fichiers tels que tu les vois/modifies
2. **Staging area** (via `git add`) — ce qui sera inclus dans le prochain commit
3. **Repository** (via `git commit`) — l'historique permanent local

`git diff` montre les changements non stagés ; `git diff --staged` montre ce qui est prêt à être commité. `git add` n'envoie rien nulle part, ça prépare seulement le commit suivant.

## Branches (l'essentiel)

```bash
git branch                    # lister les branches
git checkout -b feature/scan   # créer et basculer sur une nouvelle branche
git checkout main              # revenir sur main
git merge feature/scan          # fusionner la branche dans celle courante
```

En solo, tu n'as pas toujours besoin de branches complexes, mais l'habitude de séparer une expérimentation (`feature/...`) du code stable (`main`) évite de casser un outil qui fonctionne pendant que tu testes une idée.

## .gitignore : ne jamais committer ça

Un fichier `.gitignore` liste ce que Git doit ignorer. Absolument critique en sécurité :

```
.env
*.key
*.pem
credentials.txt
node_modules/
__pycache__/
```

Committer une clé API ou un mot de passe dans un dépôt — même privé, même supprimé ensuite — le laisse dans l'historique Git pour toujours, récupérable. C'est une des fuites de credentials les plus fréquentes en sécurité réelle.

## Structurer un write-up

Un bon write-up de lab/CTF suit une structure reproductible :

```markdown
# Nom de la machine/challenge

## Résumé
Une phrase : quelle vulnérabilité, quel impact.

## Reconnaissance
Ce que révèle le scan initial (ports, services, versions).

## Exploitation
Étape par étape, avec les commandes exactes utilisées et pourquoi.

## Élévation de privilèges
Comment tu es passé d'un accès limité à root/admin.

## Leçons apprises
Ce que tu retiens, ce que tu ferais différemment.
```

Ce format n'est pas arbitraire : c'est exactement ce qu'un rapport de pentest professionnel attend, et c'est ce que recruteurs et mentors regardent en premier dans un portfolio GitHub.

## Pièges fréquents

- Un historique de commits avec uniquement des messages "fix", "update", "wip" — illisible pour quiconque (y compris toi dans 3 mois).
- Committer un `.env` par erreur avant d'avoir configuré le `.gitignore` — le retirer après coup ne suffit pas, il faut réécrire l'historique (`git filter-repo` ou changer les secrets exposés).
- Des write-ups qui ne montrent que le résultat final sans expliquer le raisonnement — l'objectif est de prouver ta méthode, pas juste le flag trouvé.

## Pour le lab

Crée un dépôt GitHub dédié à ton parcours Hackerhood, écris un premier write-up sur le lab Bandit fait plus tôt en suivant exactement la structure ci-dessus — c'est la première brique de ton portfolio (chapitre "Projet Final & Portfolio" en fin de programme).
