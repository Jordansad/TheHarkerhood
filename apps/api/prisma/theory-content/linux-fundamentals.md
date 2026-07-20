Linux fait tourner la grande majorité des serveurs, des routeurs, et des machines que tu vas attaquer ou défendre en lab. Avant de faire du pentest, il faut être à l'aise dans un shell : naviguer, lire, chercher, comprendre les permissions.

## Objectifs

- Naviguer dans l'arborescence et manipuler fichiers/dossiers en ligne de commande
- Comprendre le modèle de permissions Unix (rwx, propriétaire/groupe/autres)
- Lire les logs et gérer les processus de base

## Arborescence et navigation

Tout part de la racine `/`. Les dossiers clés à connaître :

- `/etc` — fichiers de configuration système (`/etc/passwd`, `/etc/shadow`, `/etc/hosts`...)
- `/home` — répertoires personnels des utilisateurs
- `/var/log` — logs système, souvent la première chose à checker en forensics
- `/tmp` — fichiers temporaires, souvent writable par tout le monde (intéressant en privesc)
- `/usr/bin`, `/bin` — binaires exécutables du système

Commandes de base :

```bash
pwd                 # où je suis
ls -la               # liste tout, y compris fichiers cachés (.), avec détails
cd /var/log          # se déplacer
find / -name "*.conf" 2>/dev/null   # chercher un fichier par nom
grep -r "password" /etc 2>/dev/null # chercher du texte dans des fichiers
cat, less, tail -f    # lire un fichier (tail -f pour suivre un log en direct)
```

`find` et `grep` sont tes meilleurs amis en reconnaissance locale : sur une machine compromise, c'est comme ça que tu cherches des credentials qui traînent, des fichiers de config sensibles, ou des scripts mal protégés.

## Permissions : le cœur du système Linux

Chaque fichier a un propriétaire, un groupe, et des droits pour trois catégories : le propriétaire (**u**ser), le groupe (**g**roup), les autres (**o**thers). Chaque catégorie a trois droits : **r**ead, **w**rite, e**x**ecute.

```
-rwxr-xr--  1 alice  devs   1204  Jan 10 10:00 script.sh
```

Se lit : propriétaire `alice` peut lire/écrire/exécuter ; le groupe `devs` peut lire/exécuter ; les autres peuvent seulement lire.

En notation octale : r=4, w=2, x=1. `chmod 754 script.sh` donne rwx (7) au propriétaire, r-x (5) au groupe, r-- (4) aux autres. `chmod +x` ajoute juste le droit d'exécution sans toucher au reste — le plus utilisé au quotidien.

`chown user:group fichier` change le propriétaire et le groupe. Il faut être root (ou owner selon les droits) pour l'utiliser.

**Le bit SUID** (`chmod u+s` / affiché comme `s` à la place du `x` propriétaire) fait qu'un exécutable tourne avec les droits de son propriétaire, pas de celui qui le lance. C'est exactement ce que tu vas chercher plus tard en privilege escalation (`find / -perm -4000 2>/dev/null`) : un binaire SUID appartenant à root mal configuré = accès root.

## Utilisateurs et processus

`/etc/passwd` liste les comptes (nom, UID, shell...) — lisible par tous. `/etc/shadow` contient les hash des mots de passe — lisible seulement par root, une cible fréquente une fois un accès élevé obtenu.

```bash
whoami; id            # qui je suis, quels groupes
sudo -l                 # quelles commandes je peux lancer en sudo (essentiel en privesc)
ps aux                  # tous les processus qui tournent
ps aux | grep root      # processus qui tournent en root, potentielles cibles
systemctl status ssh    # état d'un service
```

`sudo -l` est probablement la première commande à lancer sur une nouvelle machine : elle te dit directement si tu peux exécuter certains programmes en root sans mot de passe, ce qui est souvent une voie d'escalade immédiate (voir GTFOBins plus tard dans la roadmap).

## Pièges fréquents

- Confondre les permissions du **dossier** et du **fichier** : pour supprimer un fichier, c'est le droit d'écriture sur le **dossier parent** qui compte, pas sur le fichier lui-même.
- Oublier `2>/dev/null` sur `find` depuis `/` : le terminal se noie sous les "Permission denied", masquant les résultats utiles.
- Lancer des commandes en sudo par réflexe sans avoir vérifié `sudo -l` — sur une vraie mission, chaque commande laisse une trace.

## Pour le lab

Le lab **Bandit** (OverTheWire) te fait progresser à travers ~30 niveaux, chacun demandant de trouver un mot de passe caché en utilisant exactement les commandes vues ici : navigation, `find`, `grep`, permissions. C'est littéralement une application directe de ce cours, niveau par niveau.
