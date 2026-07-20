Obtenir un premier accès n'est souvent que la moitié du travail : cet accès est fréquemment limité (utilisateur non privilégié), et l'objectif suivant est d'obtenir les droits root. La privilege escalation Linux consiste à chercher méthodiquement les mauvaises configurations qui permettent cette élévation.

## Objectifs

- Connaître les 4 vecteurs de privesc Linux les plus fréquents
- Utiliser les commandes d'énumération manuelle avant de t'appuyer sur des scripts automatisés
- Savoir exploiter un binaire SUID via GTFOBins

## Méthodologie : toujours énumérer avant d'exploiter

La tentation est de foncer sur un exploit de kernel dès l'arrivée sur une machine — c'est presque toujours la mauvaise approche. La bonne pratique : énumérer systématiquement la configuration avant de chercher un exploit, parce que la plupart des privesc réelles viennent d'une **mauvaise configuration**, pas d'une faille logicielle complexe.

```bash
sudo -l                          # commandes utilisables en sudo sans mot de passe ?
find / -perm -4000 2>/dev/null   # binaires SUID
find / -writable -type d 2>/dev/null | grep -v proc   # dossiers writables
crontab -l ; cat /etc/crontab    # tâches planifiées, souvent lancées en root
id ; groups                      # groupes inhabituels (docker, lxd...)
cat /etc/os-release ; uname -a   # version exacte, pour chercher un exploit kernel
```

Des scripts comme **LinPEAS** automatisent cette énumération et mettent en évidence (souvent en couleur) les pistes les plus prometteuses — utiles pour gagner du temps, mais comprendre ce qu'ils cherchent reste indispensable pour interpréter correctement leurs résultats.

## Vecteur 1 : sudo mal configuré

`sudo -l` révèle parfois des commandes utilisables en root sans mot de passe. Si l'une d'elles permet d'exécuter du code arbitraire (un éditeur, un interpréteur, un outil avec une option d'exécution de commande), c'est une escalade directe.

## Vecteur 2 : binaires SUID et GTFOBins

Revois le cours Linux Fundamentals : un binaire SUID s'exécute avec les droits de son propriétaire. Si un binaire SUID appartenant à root a une fonctionnalité qui permet d'exécuter une commande arbitraire (un éditeur qui permet de lancer un shell, par exemple), c'est root immédiat.

```bash
find / -perm -4000 -type f 2>/dev/null
```

**GTFOBins** (gtfobins.github.io) est une base de données de binaires Unix légitimes et de la façon de les détourner pour élever ses privilèges ou contourner des restrictions. Le réflexe : chaque binaire SUID trouvé qui n'est pas standard (pas `/usr/bin/passwd`, `/usr/bin/sudo`...) mérite une recherche sur GTFOBins — le site indique directement la commande à taper pour exploiter ce binaire précis, que ce soit via SUID, sudo, ou capacité Linux.

## Vecteur 3 : cron jobs

Une tâche planifiée qui s'exécute en root et appelle un script sur lequel un utilisateur non privilégié a un droit d'écriture est une escalade quasi garantie : modifier ce script pour y injecter une commande, attendre la prochaine exécution planifiée.

```bash
cat /etc/crontab
ls -la /chemin/vers/script_lance_par_cron.sh   # writable ?
```

## Vecteur 4 : exploits kernel

Quand aucune mauvaise configuration n'est trouvée, la version exacte du noyau Linux peut correspondre à une CVE connue avec un exploit public (ex : DirtyCow, PwnKit). Plus risqué (peut planter la machine) et généralement une option de dernier recours après avoir épuisé les vecteurs de configuration.

## Groupes spéciaux

Appartenir au groupe `docker` sans être root permet souvent une élévation immédiate : lancer un conteneur avec le système de fichiers hôte monté donne un accès root effectif à la machine hôte. `lxd` présente un principe similaire. `id` en tout début d'énumération révèle ces groupes.

## Pièges fréquents

- Sauter directement à un script d'énumération automatisé sans comprendre ce qu'il cherche — inefficace pour interpréter un résultat ambigu ou pour progresser quand le script ne trouve rien d'évident.
- Ignorer `sudo -l`, souvent la vérification la plus rapide et la plus rentable, réalisée en une seule commande.
- Lancer un exploit kernel en premier réflexe, avec le risque de crasher la machine, avant d'avoir épuisé les vecteurs de configuration plus sûrs.

## Pour le lab

Les labs de privilege escalation Linux sur **TryHackMe** et **HTB** te font pratiquer ces 4 vecteurs sur des machines réelles — commence toujours par les 5 commandes d'énumération ci-dessus avant de chercher un exploit.
